const { Router } = require('express');
const Routers = Router();
const usersControllers = require('./users.controllers');

Routers.get('/', usersControllers.usersGet);
Routers.get('/:id', usersControllers.validateId, usersControllers.usersGetByID);
Routers.get('/current', usersControllers.getCurrentUser);
Routers.post('/auth/register', usersControllers.validationBodyRules, usersControllers.registerUser);
Routers.post('/auth/login', usersControllers.validateSignIn, usersControllers.logIn);
Routers.delete('/:id', usersControllers.validateId, usersControllers.usersDel);
Routers.patch('/:id', usersControllers.validateId, usersControllers.validationUpdateBodyRules, usersControllers.usersUpdate);
Routers.post('/auth/logout', usersControllers.authorize, usersControllers.logout);

module.exports = Routers;
