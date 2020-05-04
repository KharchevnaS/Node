const {Router} = require('express');
const Routers = Router();

const contactsControllers = require('./contacts.controllers');

Routers.get('/', contactsControllers.contactsGet);
Routers.get('/:id', contactsControllers.contactsGetByID);
Routers.post('/', contactsControllers.addContact);
Routers.delete('/:id', contactsControllers.contactsDel);
Routers.patch('/:id', contactsControllers.contactsUpdate);

module.exports = Routers;