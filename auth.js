const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport'); // Your local passport file

let generateJWTToken = (user) => {
  return jwt.sign(
    { _id: user._id },  // Only include user ID in the payload
    jwtSecret,
    {
    subject: user.Username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // This specifies that the token will expire in 7 days
    algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
  });
}


/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Can not login',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user); 
        return res.json({ user, token }); // Return user data and the token
      });
    })(req, res);
  });
}

// module.exports = (router) => {
//   router.post('/login', (req, res) => {
//     passport.authenticate('local', { session: false }, async (error, user, info) => {
//       if (error) {
//         // Handle any authentication errors (like database connection issues)
//         console.log('Authentication error:', error);
//         return res.status(500).json({
//           message: 'Something went wrong with the authentication process.',
//           error: error.message,
//         });
//       }     
//       if (!user) {
//         console.log('Authentication failed:', info.message);
//         return res.status(401).json({
//           message: info.message,
//         });
//       }
//       req.login(user, { session: false }, (error) => {
//         if (error) {
//           console.log('Login error:', error);
//           return res.status(500).json({ message: 'Login error: ' + error.message });
//         }
//         let token = generateJWTToken(user); 
//         return res.json({ user, token }); // Return user data and the token
//       });
//     })(req, res);
//   });
// };