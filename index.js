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

app.listen(5000, () => console.log('Server started on port 5000'));