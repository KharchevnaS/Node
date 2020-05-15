const { Router } = require('express');
const Routers = Router();
const usersControllers = require('./users.controllers');

Routers.get('/', usersControllers.usersGet);
Routers.get('/auth/current', usersControllers.authorize, usersControllers.getCurrentUser);
Routers.get('/:id', usersControllers.validateId, usersControllers.usersGetByID);
Routers.post('/auth/register', usersControllers.validationBodyRules, usersControllers.addUser);
Routers.post('/auth/login', usersControllers.validateSignIn, usersControllers.signIn);
Routers.delete('/:id', usersControllers.validateId, usersControllers.usersDel);
Routers.patch('/:id', usersControllers.validateId, usersControllers.validationUpdateBodyRules, usersControllers.usersUpdate);
Routers.post('/auth/logout', usersControllers.authorize, usersControllers.logout);

module.exports = Routers;
