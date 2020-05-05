const express = require('express');
const contactsRouter = express.Router();
const contacts = require('../controllers/contacts');

contactsRouter.get('/', contacts.listContacts);
contactsRouter.get(
  '/:id',
  contacts.validationBodyRules,
  contacts.getContactById,
);
contactsRouter.post('/', contacts.addContact);
contactsRouter.delete('/:id', contacts.removeContact);
contactsRouter.patch(
  '/:id',
  contacts.validationUpdateBodyRules,
  contacts.updateContact,
);

module.exports = contactsRouter;
