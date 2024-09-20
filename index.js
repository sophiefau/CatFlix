const express = require('express');
      morgan = require('morgan');
      fs = require('fs');
      bodyParser = require('body-parser');
      uuid = require('uuid');
      app = express();
      mongoose = require('mongoose');
      Models = require('./models.js');

// Import data from model.js
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/CatFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Serve the “documentation.html” file from the public folder
app.use(express.static('public'));

// Parse incoming request (POST)
app.use(bodyParser.json());




// READ
app.get('/', (req, res) => {
  res.send('Welcome to CatFlix, an app showcasing movies featurings cats!');
});

// READ Return a list of all movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// READ Return data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
      res.status(200).json(movie);
  } else {
      res.status(400).send('No movie was found...');
  }
});

// READ Return data about a specific genre
app.get('/genres/:genre', (req, res) => {
  const { genre } = req.params;
  const genreDescription = genres[genre];

  if (genreDescription) {
  res.status(200).json({ genre: genre, description: genreDescription });
} else {
  res.status(400).send('This genre was not found....');
}
});

// READ Return data about the featured cat (name, color/breed, bio) by name.
app.get('/movies/cat/:catName', (req, res) => {
  const { catName } = req.params;
  const cat = movies.find( movie => movie.Cat.Name === catName ).Cat;

  if (cat) {
  res.status(200).json(cat);
} else {
  res.status(400).send('No cat was found...');
}
});

// CREATE Allow new users to register
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (!newUser.email) {
    newUser.email = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
   
  } else {
    res.status(400).send(message);
    const message = 'Missing email in request';
  }
});

// UPDATE Allow users to update their user info (username)
app.put('/users/:username', (req, res) => {
  const { username } = req.params;
  const { updatedUsername } = req.body;

  let user = users.find( user => user.Username === username );

  if (user) {
    user.Username = updatedUsername;
    res.status(200).send('Your username has been updated to:' + req.params.username);
  } else {
    res.status(400).send('An error occured, please try again');
  }
});

// POST Allow users to add a movie to their favorites
app.post('/users/:username/:movieTitle', (req, res) => {
  const { username, movieTitle } = req.params;

  let user = users.find( user => user.Username === username );

  if (user) {
    user.Favorites.push(movieTitle);
    res.status(201).send('The movie ' + movieTitle + ' has been added to your favorites!');
  } else {
    res.status(404).send('Could not add this movie to your favorites...');
  }
});


// DELETE Allow users to remove a movie from their favorites
app.delete('/users/:username/:movieTitle', (req, res) => {
  const { username, movieTitle } = req.params;

  let user = users.find( user => user.Username === username );

  if (user) {
    user.Favorites = user.Favorites.filter( title => title !== movieTitle);
    res.status(201).send('The movie ' + movieTitle + ' has been removed from your favorites!');
  } else {
    res.status(404).send('Could not remove this movie to your favorites...');
  }
});

// DELETE Allow a user to deregister
app.delete('/users/:username', (req, res) => {
  const { username } = req.params;
  
  let user = users.find( user => user.Username === username );
  
  if (user) {
    users = users.filter( user => user.Username !== username );
    res.status(200).send('The user ' + username + ' has been deregistered.');
  } else {
    res.status(404).send('Could not deregister user');
  }
});

// Morgan request to log requests into the terminal
app.use(morgan('common'));

// Log errors in log.txt
app.use((req, res, next) => {
  let addr = req.protocol + '://' + req.get('host') + req.originalUrl; 
  let logDetails = 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n';

 fs.appendFile('log.txt', logDetails, (err) => {
    if (err) {
      console.log('Failed to write to log: ', err);
    }
  });

  next(); 
});

// Errors-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});