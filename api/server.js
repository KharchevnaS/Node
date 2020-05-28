const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const morgan = require("morgan");
const Routers = require('./user/users.routers');
require('dotenv').config();

module.exports = class UsersServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMidelwares();
    await this.initDatabase();
    this.initRouters();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMidelwares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(cors());
    this.server.use(morgan("combined"));
  }

initRouters() {
  this.server.use(express.static('public'));
  this.server.use('/users', Routers);
 
}

async initDatabase() {
    await mongoose.connect(process.env.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('connected sucessfully to server');
};

  startListening() {
      try{
    const PORT = process.env.PORT;
    this.server.listen(PORT, () => {
      console.log('listening on port', PORT);
    })
  }
    catch (e){
    console.log('Server error', e.message)
    process.exit(1)
    }
  }
}
