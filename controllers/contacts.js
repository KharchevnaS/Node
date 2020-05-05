const fs = require("fs");
const path = require('path');
const Joi = require('joi');

const contactsPath = path.join(__dirname, "../db/contacts.json");
const contacts = fs.readFileSync(contactsPath, 'utf-8');
const contactsArray = JSON.parse(contacts);

function listContacts(req, res) {
    res.status(200).send(contactsArray);
    console.log(req.body,'listcontacts')
};

function getContactById(req, res) { 
let contact = contactsArray.find((contact) => contact.id === Number(req.params.id));
if (contact == undefined){
  res.status(404).json({"message": "Not found"})
}
res.status(200).send(contact);
console.log(res.body,'getcontactby id')
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

   lastId = contactsArray.length +1;
   let newContact = { 
      id: lastId, 
      name:req.body.name, 
      email:req.body.email, 
      phone: req.body.phone }; 

let contactUpdate = JSON.stringify([...contactsArray, newContact]);
fs.writeFile(contactsPath, contactUpdate, function(err) {
   if (err) {
     throw (err)
   }
   res.status(201).send(newContact);
 });
};

function removeContact(req, res) {
let contacts = contactsArray.filter((contact) => contact.id !== Number(req.params.id));
fs.writeFile(contactsPath, JSON.stringify(contacts), function(err) {
if (err) {
   return res.status(400).json({"message": "Not found"});
};
res.status(200).send(JSON.stringify(contacts));
});
console.log(res.body, 'remove contact')
};

function validationUpdateBodyRules(req, res, next){
  const bodyRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  });
  const validationResult = Joi.validate(req.query, bodyRules);
  if (validationResult.error) {
    return res.status(400).json({"message": "missing required name field"})
  }
  next();
};

function updateContact(req, res, next) {
  const id = parseInt(req.params.id);
  let targetContactindex = contactsArray.findIndex(contact => contact.id === id);
  if (targetContactindex === -1){
   return res.status(404).json({"message": "Not found"})
  };
  
 contactsArray[targetContactindex] = {
   ...contactsArray[targetContactindex],
   ...req.body
 };
 console.log('contactsArray', contactsArray);
 return res.status(200).send(contactsArray);
};
   
module.exports = {
  listContacts,
  addContact,
	getContactById,
	removeContact,
  updateContact,
  validationBodyRules,
  validationUpdateBodyRules
};