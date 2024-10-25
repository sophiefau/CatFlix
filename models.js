const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt"); 

let movieSchema = new Schema({
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

let userSchema = new Schema({
  Username: { type: String, required: true, unique: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
});

// HashPassword function
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Compares submitted hashed passwords
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

const Movie = model("Movie", movieSchema);
const User = model("User", userSchema);

module.exports = { Movie, User };
// const _Movie = Movie;
// export { _Movie as Movie };
// const _User = User;
// export { _User as User };
