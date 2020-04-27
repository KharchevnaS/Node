const fs = require("fs");
const path = require('path');
const Joi = require('joi');

const contactsPath = path.join(__dirname, "./db/contacts.json");
const contacts = fs.readFileSync(contactsPath, 'utf-8');
const contactsArray = JSON.parse(contacts);

function listContacts(req, res) {
    res.status(200).send(contactsArray);
};

function getContactById(req, res) { 
let contact = contactsArray.find((contact) => contact.id === Number(req.params.id));
res.status(200).send(contact);
if (err){
res.status(404).json({"message": "Not found"})
}
};

function validationBodyRules(req, res, next){
  const bodyRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const validationResult = Joi.validate(req.query, bodyRules);
  if (validationResult.error) {
    return res.status(400).json({"message": "missing required name field"})
  }
  next();
};

function addContact(req, res, next){
  validationBodyRules,
   lastId = contactsArray.length +1;
   let newContact = { 
      id: lastId, 
      name:req.body.name, 
      email:req.body.email, 
      phone: req.body.phone }; 

let contactUpdate = JSON.stringify([...contacts, newContact]);
fs.writeFile(contactsPath, contactUpdate, function(err) {
   if (err) {
 throw err
   }
   res.status(201).send(newContact);
 });
};

function removeContact(req, res) {
let contacts = contactsArray.filter((contact) = contact.id !== Number(req.params.id));
fs.writeFile(contactsPath, JSON.stringify(contacts), function(err) {
if (err) {
   return res.status(400).json({"message": "Not found"});
};
res.status(200).send(contacts);
});
};

function updateContact( req, res, next) {

let contact = contactsArray.find((contact) => contact.id === Number(req.params.id));
  contact.name = req.body.name 
  contact.email = req.body.email 
  contact.phone = req.body.phone; 

  res.status(200).send(contact);      

if (error){
  res.status(404).json({"message": "Not found"})
};
};
 
module.exports = {
  listContacts,
  addContact,
	getContactById,
	removeContact,
	updateContact
};