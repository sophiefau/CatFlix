const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  ImgPath: String,
  Director: [String],
  Cat: {
    Name: String,
    ColorBreed: String,
    Bio: String
  },
  Genre: {
    Name: String,
    Description: String
  },
  Animation: Boolean,
  Year: [String],
  Synopsis: {type: String, required: true}
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;