const fs = require("fs");
const path = require('path');
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");

 async function listContacts() {
 let  dataList = await fsPromises.readFile(contactsPath, 'utf-8', (error, data) => {
   if (error) {
      console.log(error)
   }
   return data;
});
console.table(JSON.parse(dataList));
};

async function getContactById(contactId) {
 let contactById = await fsPromises.readFile(contactsPath, 'utf-8', (error, data)=> {
  if (error) {
     console.log(error)
  }
  return data;
});
let foundContactId = JSON.parse(contactById).find((elem) => elem.id === contactId);
console.log(foundContactId)
};

async function addContact(name, email, phone) {
 let contactsAll = await fsPromises.readFile(contactsPath, 'utf-8', (error, data) => {
      if (error){
         console.log(error, 'error addcontacts');
      }
      return data;
   });
   const contacts = JSON.parse(contactsAll);
   lastId = contacts.length +1;
   const newContact = { id: lastId, name, email, phone };

   await fsPromises.writeFile(contactsPath, JSON.stringify([...contacts, newContact]), (err) => {
   if (err) 
      throw err;
});
listContacts();
   };

   
async function removeContact(contactId) {
 let removeContacts = await fsPromises.readFile(contactsPath, "utf-8", (error, data) => {
         if (error) {
            console.log(error)
         }
         return data;
      });
   const arrayFilter = JSON.parse(removeContacts).filter((elem)=> elem.id !== contactId);
   await fsPromises.writeFile(contactsPath, JSON.stringify(arrayFilter), (err) => {
        if (err) throw err;
     })
     listContacts();
      };
      
module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact
};