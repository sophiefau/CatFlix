## CatFlix

This project is a small movies web application, with a catalog of movies featuring cats.
The web application will provide users with access to information about different movies and featured cats for each movies. Users will be able to sign up, update their personal information, and create a list of their favorite movies.

# Features
Here is a list of the CatFlix app essential features:

- Return a list of all movies to the user
- Return data (title, description, movie poster, director, cat, genre, year, whether it’s animated or not) about a single movie by Id to the user
- Return data about the cat character (name, color/breed, bio, featured movies) by name
- Allow new users to register
- Allow users to update their user info (username, password, email)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister
- Return errors messages for forms input

# Dependancies

**Node.js** → for building the API
**Express** → for running the code
**MongoDB** → to build the database
**MongoDB Atlas** → to manage the database
**Heroku** → for hosting
**Swagger** → to build the documentation


# API Endpoints

- **GET** /movies: Retrieves all movies.
- **GET** /movies/:id: Retrieves detailed information for a single movie.
- **GET** /cats: Retrieves all cats.
- **GET** /cats/name: Retrieves detailed information for a single cat.
- **POST** /signup: Registers a new user.
- **POST** /login: Authenticates a user.
- **PUT** /users/:username: Updates user profile data.
- **POST** /users/:username/:movieId: Adds a movie to user favorites.
- **DELETE** /users/:username/:movieId: Removes a movie from user favorites.
- **DELETE** /users/:username: Delete the user account.

You can access to the documentation with Swagger: https://catflix-99a985e6fffa.herokuapp.com/api-docs/

### Deployment
- This application is deployed on [Netlify](https://catflixmovies.netlify.app) for the frontend client app and [Heroku](https://catflix-99a985e6fffa.herokuapp.com/) for the backend API.

## Contributing

If you’d like to contribute, please fork the repository and use a feature branch! =^._.^=

## License

Distributed under the MIT License.

## Acknowledgments

This project was created as part of the Web Development course at CareerFoundry.
