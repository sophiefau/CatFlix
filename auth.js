const jwtSecret = "your_jwt_secret"; // This has to be the same key used in the JWTStrategy
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("./passport"); // Your local passport file

let generateJWTToken = (user) => {
  return jwt.sign(
    { _id: user._id }, // Only include user ID in the payload
    jwtSecret,
    {
      subject: user.Username, // This is the username you’re encoding in the JWT
      expiresIn: "7d", // This specifies that the token will expire in 7 days
      algorithm: "HS256", // This is the algorithm used to “sign” or encode the values of the JWT
    }
  );
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns user data along with a JWT token. If the login fails, it provides appropriate error messages.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user trying to log in.
 *                 example: user123
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login, returns user data and token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     // Include any other user properties you want to return
 *                 token:
 *                   type: string
 *                   description: The JWT token for the authenticated user.
 *       400:
 *         description: Invalid username/password or other error messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message detailing the reason for the failure.
 *       500:
 *         description: Unexpected error during the login process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the server error.
 *   tags:
 *       - User
 */
module.exports = (router) => {
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        return res.status(400).json({
          message: "Can not login", // General error message for unexpected errors
        });
      }

      if (!user) {
        // If no user found, return the message from the info object
        return res.status(400).json({
          message: info.message || "Can not login", // Fallback message
        });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          return res.status(500).send(error);
        }

        let token = generateJWTToken(user);
        return res.json({ user, token }); // Return user data and the token
      });
    })(req, res);
  });
};
