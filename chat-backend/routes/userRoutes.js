const router = require('express').Router();
const User = require('../models/User');

//create user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    console.log(req.body);
    const user = await User.create({ name, email, password, picture });
    res.status(201).json(user);
  } catch (error) {
    if (error.code == 11000) {
      console.log('User already exists');
    } else {
      console.log(error);
    }
    res.status(400).send({ message: 'Sign up fail' });
  }
});

//login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // findByCredentials is custom! We create this method
    const user = await User.findByCredentials(email, password);
    user.status = 'online';
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

module.exports = router