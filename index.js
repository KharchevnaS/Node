const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routers/contacts.router');
const app = express();

app.use(express.json()); 
app.use(cors({ origin: "http://localhost:3001" }));

const PORT = 3001;

app.use('/api/contacts', contactsRouter);

app.listen(PORT, () => {
  console.log('server is working', PORT);
});
