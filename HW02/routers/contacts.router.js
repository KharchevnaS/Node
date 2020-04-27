const express = require('express');
const contactsRouter = express.Router();
const contacts = require('../contacts');

contactsRouter.get('/', contacts.listContacts);
contactsRouter.get('/:contactId', contacts.getContactById);
contactsRouter.post('/', contacts.addContact);
contactsRouter.delete('/:contactId', contacts.removeContact);
contactsRouter.patch('/:contactId', contacts.updateContact);

module.exports = contactsRouter;