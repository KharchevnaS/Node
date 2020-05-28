const { Router } = require('express');
const Routers = Router();
const contactsControllers = require('./contacts.controllers');


Routers.get('/',  contactsControllers.contactsGet);
Routers.get('/:id', contactsControllers.validateId, contactsControllers.contactsGetByID);
Routers.post('/', contactsControllers.validationBodyRules, contactsControllers.createContact);
Routers.delete('/:id', contactsControllers.validateId, contactsControllers.contactsDel);
Routers.patch('/:id', contactsControllers.validateId, contactsControllers.validationUpdateBodyRules, contactsControllers.contactsUpdate);

module.exports = Routers;
