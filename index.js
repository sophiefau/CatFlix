const express = require("express");
const mongoose = require("mongoose");
const Models = require("./models.js");
const morgan = require("morgan");

// Import data from model.js
const Movies = Models.Movie;
const Users = Models.User;

const app = express();

mongoose.connect("mongodb://localhost:27017/CatFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Parse incoming request (POST)
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import auth.js and passport.js
let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// READ
app.get("/", (req, res) => {
  res.send("Welcome to CatFlix, an app showcasing movies featurings cats!");
});

// READ Return a list of all movies
app.get("/movies", passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:  " + err);
    });
});

// READ Get movie by title NOT OK
app.get("/movies/:title", async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:  " + err);
    });
});

// READ Get a Genre by name
app.get("/genres/:Name", async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.Name })
    .then((genre) => {
      if (genre) {
        res.json(genre.Genre);
      } else {
        res
          .status(404)
          .send("Genre with the name " + req.params.Name + " was not found.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// READ Get a cat details by name
app.get("/cats/:Name", async (req, res) => {
  await Movies.findOne({ "Cat.Name": req.params.Name }) // Adjusted to search in the Cat object
    .then((movie) => {
      if (movie) {
        const catDetails = {
          Name: movie.Cat.Name,
          ColorBreed: movie.Cat.ColorBreed,
          Bio: movie.Cat.Bio,
          Title: movie.Title,
          Genre: movie.Genre.Name,
        };
        res.json(catDetails);
      } else {
        res
          .status(404)
          .send("No movie with a cat named " + req.params.Name + " was found.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// READ Get all users
app.get("/users", async (req, res) => {
  await Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// READ Get a user by username
app.get("/users/:Username", async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// CREATE Allow new users to register
app.post("/users", async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res
              .status(201)
              .json({ Username: user.Username, Email: user.Email });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// UPDATE Allow users to update their user info (username, password, email, date of birth)
app.put("/users/:Username", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  ) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// POST Allow users to add a movie to their favorites
app.post("/users/:Username/favorites/:movieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.movieID },
    },
    { new: true }
  ) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// DELETE Allow users to remove a movie from their favorites
app.delete("/users/:username/favorites/:movieID", async (req, res) => {
  await Users.findOneAndUpdate(
    {
      Username: req.params.username,
    },
    {
      $pull: { FavoriteMovies: req.params.movieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send(req.params.username + " was not found");
      }
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// DELETE Delete a user by username
app.delete("/users/:Username", async (req, res) => {
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Morgan request to log requests into the terminal
app.use(morgan("common"));

// Log errors in log.txt
app.use((req, res, next) => {
  let addr = req.protocol + "://" + req.get("host") + req.originalUrl;
  let logDetails = "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n";

  fs.appendFile("log.txt", logDetails, (err) => {
    if (err) {
      console.log("Failed to write to log: ", err);
    }
  });

  next();
});

// Errors-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
