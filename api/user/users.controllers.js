const userModel = require('./user.model');
const bcryptjs =  require('bcryptjs');
const { Types: { ObjectId }} = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../helpers/errors.constructor');
const _ = require('lodash');

module.exports = class UsersControllers {
constructor() {
this._costFactor = 7;
};
get addUser() {
  return this._addUser.bind(this);
};

get usersGet () {
  return this._usersGet.bind(this);
};

get usersGetByID() {
  return this._usersGetByID.bind(this);
};

get  getCurrentUser() {
  return this._getCurrentUser.bind(this);
};

  async _addUser(req, res, next) {
    try {
      const { password, email } = req.body;
      const passwordHash = await bcryptjs.hash(password, this._costFactor);
      const existingUser =  await userModel.findUserByEmail(email);
 if (existingUser) {
  return res.status(409).send({ "message": "Email in use"})
}
    const user = await userModel.create({
        name,
        email,
        password: passwordHash
      });
      return res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    } catch (err) {
      next(err);
    }
  };

  async signIn(req, res, next) {
 try {
const {email, password} = req.body;
const user = await userModel.findUserByEmail(email);
if (!user){
  return  res.status(400).json({ "message": "Неверный логин или пароль"})
}
const isPasswordValid = await bcryptjs.compare(password, user.password);
if (!isPasswordValid) {
  return res.status(400).json({ "message": "Неверный логин или пароль"})
}
const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: 1*10*5*10,
});
await userModel.updateToken(user._id, token);
return res.status(200).json({token});
}
 catch(err){
   next(err);
 }
  };

  async _usersGet(req, res, next) {
    try {
      const userFind = await userModel.find();
      return res.status(200).json(this.prepareUsersResponse(userFind));
    } catch (err) {
      next(err);
    }
  };

  async _usersGetByID(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await userModel.findById({ userId });
      if (!user) {
        return res.status(404).send();
      }
      const [userForResponse] = this.prepareUsersResponse([user]);
      return res.status(200).send(userForResponse);
    } catch (err) {
      next(err);
    }
  };

  async usersDel(req, res, next) {
      try {
          const userId = req.params.id;
          const deletedUser = await userModel.findByIdAndDelete(userId);
          if (!deletedUser) {
              return res.status(404).send();
            }
            res.status(204).send('sucessfully deleted');
        } catch (err) {
            next(err);
        }
  };

  async usersUpdate(req, res, next) {
        try {
            const userId = req.params.id;
            const userUpdate = await userModel.findByIdAndUpdate(userId, {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                },
                new: true,
            });
            if (!userUpdate) {
                return res.status(404).send();
            }
            res.status(204).send(userUpdate);
        } catch (err) {
            next(err);
        }
  };

  async logout(req, res, next) {
  try {
const user = req.user;
await userModel.updateToken(user._id, null); 
return res.status(204).send();
  }
  catch(err){
    res.status(401).json({"message": "Not authorized"});
  }
  };

  async _getCurrentUser(req, res, next) {
    try{
   const [ userForResponse ]= this.prepareUsersResponse([req.user]);
     return res.status(200).json(userForResponse);
    }
    catch(err){
     res.status(401).json({"message": "Not authorized"})
    }
  }; 

  async  authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("Not authorized"));
      }
      
      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError("Not authorized");
      }
      req.user = user;
      req.token = token;
  
      next();
    } catch (err) {
      next(err);
    }
  };
    
  validateId(req, res, next) {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send();
      }
      next();
  };

  validationBodyRules(req, res, next) {
        const bodyRules = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
           
        });
        const validationResult = Joi.validate(req.query, bodyRules);
        if (validationResult.error) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    next();
  };

  validationUpdateBodyRules(req, res, next) {
    const bodyRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
     
    });
    const validationResult = Joi.validate(req.query, bodyRules);
    if (validationResult.error) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    next();
  };

  validateSignIn(req, res, next) {
const signInRules = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
})
const validationResult = Joi.validate(req.query, signInRules);
if (validationResult.error) {
  return res.status(400).send(validationResult.error);
}
next();
  };

  prepareUsersResponse(users) {
    return users.map((user) => { 
      const { _id, email, password, subscription } = user;
      return { id: _id, email, password, subscription };
    })
};
};
