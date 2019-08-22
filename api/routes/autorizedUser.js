const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.set('useEnsureIndex', false);
const assert = require('assert');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth');
const dbUrl = ('mongodb://localhost:27017/authorizedUsers');
const User = require('../models/authorizedUser');

router.get('/hello', (req, res, next) => {
    res.json({
        message: 'This is working'
    });
});

router.get('/get-data', (req, res, next) => {
    const dataArray = [];
    mongoose.connect(dbUrl, {useNewUrlParser: true, useCreateIndex: true}, (err, db) => {
        //assert.equal(null, err);
        const data = db.collection('user-data').find();
        data.forEach((doc, err) => {
            //assert.equal(null, err);
            dataArray.push(doc);
        }, () => {
            db.close();
            res.json({
                dataArray
            });
            console.log(dataArray);
        });
    });
});

router.post('/login', (req, res) => {
  
  // Mock user
  const user = {
    id: 2, 
    username: 'mike',
    email: 'mike@gmail.com',
  }

jwt.sign({user}, ';^&6?F/"+_=<e"V', {expiresIn: '24h'}, (err, token) => {
    res.json({
      token
    });

mongoose.connect(dbUrl, {useNewUrlParser: true, useCreateIndex: true}, (err, db) => {
    assert.equal(null, err);
    db.collection('user-data').insertOne(user, (err, res) => {
       // assert.equal(null, error);
        console.log('Item inserted');
        db.close();
      });
  });
  });
});

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

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'Mail exists'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed'
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h'
            }
          );
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          });
        }
        res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;