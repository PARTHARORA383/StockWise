require('dotenv').config()
const express = require('express')
const {User} = require('../Models/User')
const verifyToken = require('../Middleware/Tokenverification')
const router = express.Router()
const axios = require('axios')

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    console.log('Step 1: Starting Auth0 user creation');
    // Step 1: Create user in Auth0
    const auth0Response = await axios.post(
      `https://${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`,
      {
        connection: 'Username-Password-Authentication',
        email,
        password,
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Step 2: Auth0 user created successfully');
    const auth0User = auth0Response.data;

    console.log('Step 3: Saving user to database');
    // Step 2: Save user to your database
    const newUser = new User({
      auth0Id: auth0User.user_id,
      email: auth0User.email,
      name: auth0User.name,
      createdAt: new Date(),
    });

    await newUser.save();
    console.log('Step 4: User saved to database');

    // Step 3: Authenticate the user (return token)
    console.log('Step 5: Authenticating user with Auth0');
    const authResponse = await axios.post(
      `https://${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        grant_type: 'password',
        username: email,
        password: password,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.AUTH0_SECRET,
        scope: 'openid email profile',
        audience: process.env.AUDIENCE,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const { access_token, id_token } = authResponse.data;

    console.log('Step 6: Authentication successful, returning response');
    // Send token back to the user
    res.status(201).json({
      message: 'Signup successful',
      user: {
        email: auth0User.email,
        name: auth0User.name,
        token: id_token,
      },
    });
  } catch (error) {
    console.error('Error during signup:', error.response?.data || error.message);
    res.status(500).json({ message: 'Signup failed', error: error.response?.data || error.message });
  }
});





// Add user to company (for example, during login)
router.post('/' , verifyToken ,async (req, res) => {
  try {
    const user = req.oidc?.user; // The authenticated user from Auth0
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const { sub, email, name } = user; // Extract relevant user data
    
    // Find or create the user in the database
    let existingUser = await User.findOne({ auth0Id: sub });
    if (!existingUser) {
      // Create a new user
      existingUser = await User.create({ auth0Id: sub, email, name });
    }

    // Link the user to the company (assuming company is in req.body)
   
    await existingUser.save();

    // Send back a response
    return res.status(200).json({ message: 'User linked to company', user: existingUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error during login', error: err });
  }
});





router.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  
});


// API protected with JWT middleware
router.get('/protected', verifyToken , async (req, res) => {
  res.send(`Hello, ${req.user.sub}! You are authorized.`);
});


module.exports =
  router

