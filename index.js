const cors = require('cors');
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
const fs = require('fs');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const { swaggerUi, swaggerDocs } = require('./swagger'); 

const app = express();

  mongoose.connect( process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
});

// Parse incoming request (POST)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));

// Get documentation
app.use(express.static("public"));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Allow origins
app.use(cors());

let allowedOrigins = ['http://localhost:1234', 'http://localhost:8080', 'https://catflix-99a985e6fffa.herokuapp.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      console.error(message);
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

// Authentification
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');


/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: Welcome to CatFlix, an app showcasing movies with cats!
 */
app.get("/", (req, res) => {
  res.send("Welcome to CatFlix, an app showcasing movies with cats!");
});

// GET all movies
/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
app.get("/movies", passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error:  " + err);
    });
});

// GET movie by title
/**
 * @swagger
 * /movies/{title}:
 *   get:
 *     summary: Get a movie by title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Title of the movie
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 */
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
      if (movie) {
          res.json(movie);
      } else {
          res.status(404).send(
              'Movie with the title ' +
                  req.params.Title +
                  ' was not found.'
          );
      }})
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

// GET genre by name
/**
 * @swagger
 * /movies/genre/{name}:
 *   get:
 *     summary: Get a movie by genre name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the genre
 *     responses:
 *       200:
 *         description: A genre object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 */
app.get("/genres/:Name", passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// GET a cat by name
/**
 * @swagger
 * /cat/{name}:
 *   get:
 *     summary: Get a cat by name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the cat
 *     responses:
 *       200:
 *         description: A cat object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Director'
 */
app.get("/cats/:Name", passport.authenticate('jwt', { session: false }), async (req, res) => {
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

// POST create new user
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The created user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Username already exists
 */
app.post("/users", 
  [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password must be at least 8 characters long.').isLength({ min: 8 }),
  check('Email', 'Email is not valid').isEmail()
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = await Users.hashPassword(req.body.Password);

   // Check if the username already exists
   const usernameExists = await Users.findOne({ Username: req.body.Username });
   if (usernameExists) {
    console.log("Username already taken:", req.body.Username);
     return res.status(400).json({ errors: [{ param: "Username", msg: "Username already exists" }] });
   }

   // Check if the email already exists
   const emailExists = await Users.findOne({ Email: req.body.Email });
   if (emailExists) {
    console.log("Email already exists:", req.body.Email);
     return res.status(400).json({ errors: [{ param: "Email", msg: "Email already exists" }] });
   }
  
   try {
    const user = await Users.create({
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    });
    res.status(201).json({ Username: user.Username, Email: user.Email, Birthday: user.Birthday });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: [{ msg: "Error creating user: " + error.message }] });
  }
}
);

// GET all users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/users", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission denied');
  }
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
app.get("/users/:Username", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission denied');
  }
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json({ Username: user.Username, Email: user.Email, Birthday: user.Birthday });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// PUT update username, password, email, or date of birth
/**
 * @swagger
 * /users/{username}:
 *   put:
 *     summary: Update a user by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error updating user
 */
app.put("/users/:Username", 
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      }
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.status(200).json({ 
        Username: updatedUser.Username, 
        Email: updatedUser.Email, 
        Birthday: updatedUser.Birthday 
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    })
});

// POST add a movie to favorites
/**
 * @swagger
 * /users/{username}/movies/{MovieID}:
 *   post:
 *     summary: Add a movie to a user's list of favorites
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *       - in: path
 *         name: MovieID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to add
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error adding movie to favorites
 */
app.post("/users/:Username/favorites/:movieID", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission denied');
  }
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

// DELETE remove a movie from favorite
/**
 * @swagger
 * /users/{username}/movies/{MovieID}:
 *   delete:
 *     summary: Remove a movie from a user's list of favorites
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *       - in: path
 *         name: MovieID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to remove
 *     responses:
 *       200:
 *         description: The updated user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error removing movie from favorites
 */
app.delete("/users/:Username/favorites/:movieID",  passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate(
    {
      Username: req.params.Username,
    },
    {
      $pull: { FavoriteMovies: req.params.movieID },
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send(req.params.Username + " was not found");
      }
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// DELETE a user by username
/**
 * @swagger
 * /users/{username}:
 *   delete:
 *     summary: Delete a user by username
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user to delete
 *     responses:
 *       200:
 *         description: User was deleted
 *       400:
 *         description: User was not found
 */
app.delete("/users/:Username",  passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.Username){
    return res.status(400).send('Permission denied');
  }
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
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0',() => {
 console.log('Listening on Port ' + PORT);
});
