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
 *     summary: Welcome to CatFlix
 *     description: Display a welcome message for the CatFlix app.
 *     responses:
 *       200:
 *         description: A welcome message.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
app.get("/", (req, res) => {
  res.send("Welcome to CatFlix, an app showcasing movies with cats!");
});

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     description: Retrieve a list of all cat movies in the database. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of cat movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   genre:
 *                     type: string
 *       500:
 *         description: Server error.
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


/**
 * @swagger
 * /movies/{movieId}:
 *   get:
 *     summary: Get a movie by ID
 *     description: Retrieve a single cat movie by its ID. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the movie to retrieve.
 *     responses:
 *       200:
 *         description: A cat movie object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 year:
 *                   type: integer
 *                 genre:
 *                   type: string
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: Server error.
 */
app.get("/movies/:movieId", passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findById(req.params.movieId )
    .then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).send('Movie with the ID ' + req.params.movieId  + ' was not found.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//  app.get("/movies/:title", passport.authenticate('jwt', { session: false }), async (req, res) => {
//   await Movies.findOne({ title: req.params.title })
//   .then((movie) => {
//       if (movie) {
//           res.json(movie);
//       } else {
//           res.status(404).send(
//               'Movie with the title ' +
//                   req.params.title +
//                   ' was not found.'
//           );
//       }})
//   .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//   });
// });

/**
 * @swagger
 * /genres/{name}:
 *   get:
 *     summary: Get a genre by name
 *     description: Retrieve a single genre from cat movies by its name. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the genre to retrieve.
 *     responses:
 *       200:
 *         description: A genre object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Genre not found.
 *       500:
 *         description: Server error.
 */
app.get("/genres/:name", passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Genre.name": req.params.name })
    .then((genre) => {
      if (genre) {
        res.json(genre.Genre);
      } else {
        res
          .status(404)
          .send("Genre with the name " + req.params.name + " was not found.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * @swagger
 * /cats/{name}:
 *   get:
 *     summary: Get a cat by name
 *     description: Retrieve cat details from a movie by the cat's name. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the cat to retrieve.
 *     responses:
 *       200:
 *         description: Cat details from the movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Name:
 *                   type: string
 *                 ColorBreed:
 *                   type: string
 *                 Bio:
 *                   type: string
 *                 Title:
 *                   type: string
 *                 Genre:
 *                   type: string
 *       404:
 *         description: No movie with a cat of the specified name found.
 *       500:
 *         description: Server error.
 */
app.get("/cats/:name", passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Cat.name": req.params.name }) // Adjusted to search in the Cat object
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
          .send("No movie with a cat named " + req.params.name + " was found.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     description: Sign up a new user with a username, password, and email. Validations are applied. 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: Unique username for the user. Must be at least 5 characters long and alphanumeric.
 *               Password:
 *                 type: string
 *                 description: Password for the user. Must be at least 8 characters long.
 *               Email:
 *                 type: string
 *                 description: Email address for the user. Must be a valid email format.
 *               Birthday:
 *                 type: string
 *                 format: date
 *                 description: Optional birthday of the user in YYYY-MM-DD format.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Username:
 *                   type: string
 *                 Email:
 *                   type: string
 *                 Birthday:
 *                   type: string
 *       400:
 *         description: Bad request. Username or email already exists, or validation errors.
 *       422:
 *         description: Validation errors.
 *       500:
 *         description: Server error.
 */
app.post("/signup", 
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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all registered users. Requires JWT authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Username:
 *                     type: string
 *                   Email:
 *                     type: string
 *                   Birthday:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Permission denied. Only the user can access their own information.
 *       500:
 *         description: Server error.
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

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get a user by username
 *     description: Retrieve the details of a user by their username. Requires JWT authentication. The user can only access their own information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Username:
 *                   type: string
 *                 Email:
 *                   type: string
 *                 Birthday:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Permission denied. Users can only access their own information.
 *       404:
 *         description: User not found with the specified username.
 *       500:
 *         description: Server error.
 */
app.get("/users/:username", passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOne({ Username: req.params.username })
    .then((user) => {
      if (user) {
        res.status(201).json({ Username: user.Username, Email: user.Email, Birthday: user.Birthday });
      } else {
        res.status(404).send('User not found with the specified username.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

/**
 * @swagger
 * /users/{username}:
 *   patch:
 *     summary: Update user information
 *     description: Update the details of a user by their username. Requires JWT authentication. Only the fields provided in the request body will be updated.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: The new username for the user (optional).
 *               Password:
 *                 type: string
 *                 description: The new password for the user (optional).
 *               Email:
 *                 type: string
 *                 description: The new email for the user (optional).
 *               Birthday:
 *                 type: string
 *                 format: date
 *                 description: The user's birthday (optional).
 *     responses:
 *       200:
 *         description: User information updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Username:
 *                   type: string
 *                 Email:
 *                   type: string
 *                 Birthday:
 *                   type: string
 *                   format: date
 *       400:
 *         description: Validation error for the provided fields.
 *       404:
 *         description: User not found with the specified username.
 *       500:
 *         description: Server error.
 */
app.patch("/users/:username", 
  [
    check('Username', 'Username is required').optional().isLength({ min: 5 }),
    check('Username', 'Username contains non-alphanumeric characters - not allowed.').optional().isAlphanumeric(),
    check('Password', 'Password is required').optional().not().isEmpty(),
    check('Email', 'Email does not appear to be valid').optional().isEmail()
  ],
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const updateFields = {};
      
      // Only include fields that are present in the request body
      if (req.body.Username) updateFields.Username = req.body.Username;
      if (req.body.Password) {
        updateFields.Password = await hashPassword(req.body.Password);
      }
      if (req.body.Email) updateFields.Email = req.body.Email;
      if (req.body.Birthday) updateFields.Birthday = req.body.Birthday;

      const updatedUser = await Users.findOneAndUpdate(
        { Username: req.params.username }, // Ensure consistent casing
        { $set: updateFields },
        { new: true } // This line makes sure that the updated document is returned
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("Updated User:", updatedUser);

      const responseUser = {
        Username: updatedUser.Username,
        Email: updatedUser.Email,
        Birthday: updatedUser.Birthday,
      };

      res.status(200).json(responseUser); // Sends back the full updated user object
    } catch (err) {
      console.error(err);
      res.status(500).send("Error: " + err.message);
    }
});

/**
 * @swagger
 * /users/{username}/{movieId}:
 *   post:
 *     summary: Add a movie to favorites
 *     description: Add a movie to a user's favorites list by their username and the movie's ID. Requires JWT authentication. The authenticated user's username must match the username in the path.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user to add the movie to their favorites.
 *         schema:
 *           type: string
 *       - name: movieId
 *         in: path
 *         required: true
 *         description: The ID of the movie to add to favorites.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie added to favorites successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Username:
 *                   type: string
 *                 FavoriteMovies:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Permission denied or bad request due to username mismatch.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */
app.post("/users/:username/:movieId", passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log("Authenticated User:", req.user);
  if(req.user.Username !== req.params.username){
    return res.status(400).send('Permission denied');
  } 
  await Users.findOneAndUpdate(
    { Username: req.params.username },
    {
      $push: { FavoriteMovies: req.params.movieId },
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

/**
 * @swagger
 * /users/{username}/{movieId}:
 *   delete:
 *     summary: Remove a movie from favorites
 *     description: Remove a movie from a user's favorites list by their username and the movie's ID. Requires JWT authentication. The authenticated user's username must match the username in the path.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user from whom to remove the movie from favorites.
 *         schema:
 *           type: string
 *       - name: movieId
 *         in: path
 *         required: true
 *         description: The ID of the movie to remove from favorites.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie removed from favorites successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Username:
 *                   type: string
 *                 FavoriteMovies:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Permission denied due to username mismatch.
 *       404:
 *         description: User not found or movie not found in favorites.
 *       500:
 *         description: Server error.
 */
app.delete("/users/:username/:movieId",  passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.username){
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate(
    {
      Username: req.params.username,
    },
    {
      $pull: { FavoriteMovies: req.params.movieId },
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

/**
 * @swagger
 * /users/{username}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their username. Requires JWT authentication. The authenticated user's username must match the username in the path.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: The username of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Permission denied due to username mismatch or user not found.
 *       500:
 *         description: Server error.
 */
app.delete("/users/:username",  passport.authenticate('jwt', { session: false }), async (req, res) => {
  if(req.user.Username !== req.params.username){
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndDelete({ Username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + " was not found");
      } else {
        res.status(200).send(req.params.username + " was deleted.");
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
