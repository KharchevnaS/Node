const contactModel = require('./contact.model');

async function contactsGet (req, res) {
    const contactFind = await contactModel.find();
    res.send(contactFind);
};

async function contactsGetByID (req, res){

  try {
    const contact = await contactModel.findById({_id: req.params.id});
    res.send(contact);
  } catch (err) {
      res.send(err);
  }
}

async function addContact (req, res) {
    const newContact = await contactModel.create( {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    });

    res.send(newContact);
}

async function contactsDel (req, res){
    try {
        await contactModel.deleteOne({_id: ObjectID(req.params.id)})
        res.send('sucessfully delete');
    } catch (err) {
        res.send(err);
    }

}

async function contactsUpdate (req, res) {
  try {
    const contact = await contactModel.findByIdAndUpdate({_id: req.params.id}, {
      $set: {
        name: req.body.name,
        phone:req.body.phone,
        email:req.body.email
      },
      new: true
    });
    res.send(contact);
  } catch (err) {
    res.send(err);
  }
}


module.exports = { 
    contactsGet,
    contactsGetByID,
    addContact,
    contactsDel,
    contactsUpdate
};
