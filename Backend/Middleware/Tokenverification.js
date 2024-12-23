require('dotenv').config();
const jwksRsa = require('jwks-rsa');
const jwt = require('jsonwebtoken');

// Middleware to verify Auth0 tokens
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Set up the JWKS client to get the public key
  const client = jwksRsa({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
  });

  // Get the signing key for the token
  const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);
      }
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  };

  // Decode the token header to get the key ID (kid)
  jwt.decode(token, { complete: true }, (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).json({ message: 'Failed to decode token' });
    }

    // Verify the token with the appropriate public key
    jwt.verify(token, getKey, {
      audience: process.env.CLIENT_ID,
      issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,
      algorithms: ['RS256'],
    }, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      // Attach the decoded user info to the request object
      req.user = decodedToken;
      next();
    });
  });
};

console.log(verifyToken)

module.exports = verifyToken;
