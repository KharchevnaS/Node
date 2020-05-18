const contactModel = require('./contact.model');

const {
  Types: { ObjectId },
} = require('mongoose');

const Joi = require('joi');

module.exports = {
  async createContact(req, res, next) {
    try {
      const contact = await contactModel.create(req.body);
      return res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  },
  async contactsGet(req, res, next) {
    try {
      const contactFind = await contactModel.find();
      return res.status(200).send(contactFind);
    } catch (err) {
      next(err);
    }
  },

  async contactsGetByID(req, res, next) {
    try {
      const contactId = req.params.id;
      const contact = await contactModel.findById({ contactId });
      if (err) {
        return res.status(404).send();
      }
      return res.status(200).send(contact);
    } catch (err) {
      res.send(err);
    }
  },

  
  async contactsDel(req, res, next) {
      try {
          const contactId = req.params.id;
          const deletedContact = await contactModel.findByIdAndDelete(contactId);
          if (!deletedContact) {
              return res.status(404).send();
            }
            res.status(204).send('sucessfully deleted');
        } catch (err) {
            next(err);
        }
    },
    async contactsUpdate(req, res, next) {
        try {
            const contactId = req.params.id;
            const contactUpdate = await contactModel.findByIdAndUpdate(contactId, {
                $set: {
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                },
                new: true,
            });
            if (!contactUpdate) {
                return res.status(404).send();
            }
            res.status(204).send(contactUpdate);
        } catch (err) {
            next(err);
        }
    },
    
    validateId(req, res, next) {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send();
      }
      next();
    },

    validationBodyRules(req, res, next) {
        const bodyRules = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
        });
        const validationResult = Joi.validate(req.query, bodyRules);
        if (validationResult.error) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    next();
  },

  validationUpdateBodyRules(req, res, next) {
    const bodyRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const validationResult = Joi.validate(req.query, bodyRules);
    if (validationResult.error) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    next();
  }
};

// async function contactsGet (req, res) {
//     const contactFind = await contactModel.find();
//     res.send(contactFind);
// };

// async function contactsGetByID (req, res){
//  try{
//   const contact = await contactModel.findById({_id: req.params.id});
//   res.send(contact);}
//   catch (err) {
//       res.send(err);
//   }
// };

// async function addContact (req, res) {
//     const newContact = await contactModel.create( {
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone
//     });

// res.send(newContact);
// };

// async function contactsDel (req, res){
//     try {await contactModel.deleteOne({_id: ObjectID(req.params.id)})
//     res.send('sucessfully delete');}
//     catch (err) {
//         res.send(err);
//     }

// };

//  async function contactsUpdate (req, res) {
//  try {const contact = await contactModel.findByIdAndUpdate({_id: req.params.id}, {$set: {name: req.body.name, phone:req.body.phone, email:req.body.email}, new:true});
//     res.send(contact);}
//     catch (err) {
//         res.send(err);
//     }
//  };

// module.exports = {
//     contactsGet,
//     contactsGetByID,
//     addContact,
//     contactsDel,
//     contactsUpdate
// };
