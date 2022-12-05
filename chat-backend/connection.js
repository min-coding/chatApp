const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jsejgig.mongodb.net/chatAppMern?retryWrites=true&w=majority`,
  () => {
    console.log('connected to mongodb');
  }
);
