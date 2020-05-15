const express = require('express');
const mongoose = require('mongoose');
const Routers = require('./contact/contacts.routers');
require('dotenv').config();

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMidelwares();
    this.initRouters();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMidelwares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
  }

  initRouters() {
    this.server.use('/contacts', Routers);
  }
  async initDatabase() {
    await mongoose.connect(process.env.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('connected sucessfully to server');
}
  startListening() {
      try{
    const PORT = process.env.PORT;
    this.server.listen(PORT, () => {
      console.log('listening on port', PORT);
    });}
    catch (e){
    console.log('Server error', e.message)
    process.exit(1)
    }
  }
}
