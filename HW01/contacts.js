const fs = require("fs");
const path = require('path');
const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");

 async function listContacts() {
 await fsPromises.readFile(contactsPath, 'utf-8', (error, data)=> {
   if (error) {
      console.log(error)
   }
   const dataList = JSON.parse(data);
   console.table(dataList);
})
};

async function getContactById(contactId) {
 await fsPromises.readFile(contactsPath, 'utf-8', (error, data)=> {
  if (error) {
     console.log(error)
  }
 const foundId = JSON.parse(data).find((elem) => elem.id === contactId)
 console.log(foundId)
});
};

async function addContact(name, email, phone) {
   await fsPromises.readFile(contactsPath, 'utf-8', (error, data)=>{
      if (error){
         console.log(error, 'error addcontacts')
      }
      const newContact = { name, email, phone };
      const addedContacts = JSON.parse(data).push(newContact); 
      console.log(addedContacts);
   }
   )};
   
async function removeContact(contactId) {
      await fsPromises.readFile(contactsPath, "utf-8", (error, data)=>{
         if (error) {
            console.log(error)
         }
     const idDelete = JSON.parse(data).filter((elem)=> elem.id !== contactId)
     console.log(idDelete);
      }
      )};
      
module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact
};