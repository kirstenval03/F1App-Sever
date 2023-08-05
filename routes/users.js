var express = require('express');
var router = express.Router();
const User = require("../models/User");
const isAuthenticated = require('../middleware/isAuthenticated');
const isProfileOwner = require('../middleware/isProfileOwner');
const isStaff = require("../middleware/isStaff")

/* USER ROUTES */

//SEE USER DETAIL 

router.get('/user-detail/:userId', (req, res, next) =>  {
  
    const { userId } = req.params
  
    User.findById(userId)
    .then((foundUser)  => {
      res.json(foundUser)
    })
  
    .catch((err) => {
      console.log(err)
      next(err)
    })
  });

  //UPDATE PROFILE REGULAR USERS
router.post('/user-update/:userId', isAuthenticated, isProfileOwner, (req, res, next) => {

    const { userId } = req.params
  
    const { email, password, fullName, username } = req.body
  
    User.findByIdAndUpdate(
      userId,
      {
        email,
        password,
        fullName,
        username
      },
      { new: true }
    )
    .then((updatedUser) => {
      res.json(updatedUser)
    })
    .catch((err) => {
      console.log(err)
      next(err)
    })
  
  })

  //UPDATE PROFILE STAFF USERS:
  // UPDATE TEAM FOR STAFF USER
router.post('/update-team/:userId', isAuthenticated, isStaff, (req, res, next) => {
  const { userId } = req.params;
  const { team } = req.body;

  User.findByIdAndUpdate(
    userId,
    { team },
    { new: true }
  )
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  });
});

  
  module.exports = router;
  