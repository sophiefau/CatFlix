## CatFlix

CatFlix is a movie web application featuring a catalog of films centered around cats. Users can access information about various movies and the cats featured in them, sign up, update their profiles, and curate a list of their favorite films.

# Features
Essential features of the CatFlix app include:

- Retrieve a list of all movies
- Get detailed information (title, description, poster, director, cat, genre, year, animated status) for a single movie by ID
- Retrieve cat character details (name, color/breed, bio, featured movies) by name
- Allow new users to register
- Allow users to update their user info (username, password, email)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to delete their account
- Return errors messages for forms input validation

# Dependancies

- **Node.js** → for building the API
- **Express** → for server-side code execution
- **MongoDB** → for database management
- **MongoDB Atlas** → for cloud database hosting
- **Heroku** → for application hosting
- **Swagger** → for API documentation


# API Endpoints

- **GET** /movies → Retrieves all movies.
- **GET** /movies/:id → Retrieves detailed information for a single movie.
- **GET** /cats → Retrieves all cats.
- **GET** /cats/name → Retrieves detailed information for a single cat.
- **POST** /signup → Registers a new user.
- **POST** /login → Authenticates a user.
- **PUT** /users/:username → Updates user profile data.
- **POST** /users/:username/:movieId → Adds a movie to user favorites.
- **DELETE** /users/:username/:movieId → Removes a movie from user favorites.
- **DELETE** /users/:username → Delete the user account.

You can access to the documentation wvia Swagger: [API Documentation](https://catflix-99a985e6fffa.herokuapp.com/api-docs/)

### Deployment
- This application is deployed on [Netlify](https://catflixmovies.netlify.app) for the frontend client app (if you are curious about it, check the repository [CatFlix-client](https://github.com/sophiefau/CatFlix-client) ) and [Heroku](https://catflix-99a985e6fffa.herokuapp.com/) for the backend API.

## Contributing

If you’d like to contribute, please fork the repository and use a feature branch! =^._.^=

## License

Distributed under the MIT License.

## Acknowledgments

This project was created as part of the Web Development course at CareerFoundry.
