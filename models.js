const mongoose = require("mongoose");

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  ImgPath: String,
  Director: String,
  Cat: {
    Name: String,
    ColorBreed: String,
    Bio: String,
  },
  Genre: {
    Name: String,
    Description: String,
  },
  Animation: Boolean,
  Year: String,
  Synopsis: { type: String, required: true },
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: Number, ref: "Movie" }],
});

// HashPassword function
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Compares submitted hashed passwords
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
