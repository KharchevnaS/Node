const fs = require("fs");
const path = require('path');

//  тут использовать методы модуля Path
  const contactsPath = path.join(__dirname, "./db/contacts.json");

// TODO: задокументировать каждую функцию
 module.exports = function listContacts() {
 fs.readFile(contactsPath, 'utf-8', (err, data) => {
   return data
  })
};


 data.find( function getContactById(contactId) {
  
  }
 )
  
//   module.exports = function removeContact(contactId) {
//     // ...твой код
//   }
  
//   module.exports = function addContact(name, email, phone) {
//     // ...твой код
//   }