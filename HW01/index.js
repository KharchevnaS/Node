const yargs = require("yargs");

const argv = yargs
  .number("id")
  .string("action")
  .string("name")
  .string("email")
  .number("phone").argv;

let {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts.js");

const { action, id, name, email, phone } = argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      console.table(listContacts());
      break;
    case "get":
      console.log(getContactById(id));
      break;
    case "add":
      addContact({ name, email, phone });
      console.log(listContacts());
      break;
    case "remove":
      removeContact(id);
      console.log(listContacts());
      break;
    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}
invokeAction(argv);
