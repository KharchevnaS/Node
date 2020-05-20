const contactModel = require('./contact.model');
const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');


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
      if (!ObjectId.isValid(contactId)){
        return res.status(404). send();
      }
      const contact = await contactModel.findOne({ _id:contactId });
      if (!contact) {
        return res.status(404).send();
      }
      return res.status(200).json(contact);
    } catch (err) {
    next(err);
    }
  },

  async contactsDel(req, res, next) {
      try {
          const contactId = req.params.id;
          const deletedContact = await contactModel.findByIdAndDelete(contactId);
          if (!deletedContact) {
              return res.status(404).send();
            }
            res.status(204).json({ message: 'successfully deleted'});
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
        if (!validationResult) {
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
