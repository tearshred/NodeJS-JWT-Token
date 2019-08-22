const express = require('express');
// const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dbUrl = ('mongodb://localhost:27017/authorizedUsers');

// Including the authorizedUser.js in the route
const authorizedUserRoute = require('./api/routes/autorizedUser');

const app = express();

// Assigning the URL to the authorizedUserRoute constant
app.use('/', authorizedUserRoute);

// Establishing the connection with the local mongoDB database. Port 27017 is the default port
mongoose.connect(dbUrl, {
    useNewUrlParser: true
});

// Ensuring the console displays a message when the connection is established
mongoose.connection.once('open', function() {
    console.log('Connection with database established...');
}).on('error', function(error){
    console.log('Database connection error...', error); 
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API'
  });
  
});

// app.post('/api/posts', verifyToken, (req, res) => {  
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if(err) {
//       res.sendStatus(403);
//     } else {
//       res.json({
//         message: 'Post created...',
//         authData
//       });
//     }
//   });
// });

// app.post('/api/login', (req, res) => {
//   // Mock user
//   const user = {
//     id: 1, 
//     username: 'brad',
//     email: 'brad@gmail.com'
//   }

//   jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
//     res.json({
//       token
//     });
//   });
// });

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

app.listen(5000, () => console.log('Server started on port 5000'));