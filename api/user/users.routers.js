const { Router } = require('express');
const Routers = Router();
const usersControllers = require('./users.controllers');

Routers.post('/auth/register',  usersControllers.addUser);
// Routers.post('/auth/login', usersControllers.validateSignIn, usersControllers.signIn);
Routers.get('/auth/verify/:verificationToken', usersControllers.verifyEmail);
// Routers.post('/avatar',  usersControllers.uploadsAvatar);
Routers.delete('/:id', usersControllers.validateId, usersControllers.usersDel);
Routers.patch('/:id', usersControllers.validateId, usersControllers.validationUpdateBodyRules, usersControllers.usersUpdate);
// Routers.post('/auth/logout', usersControllers.authorize, usersControllers.logout);
Routers.patch(
    "/avatars",
    usersControllers.authorize,
    usersControllers.multerHandler(),
    usersControllers.updateUsersAllInfo
  );
module.exports = Routers;
