const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Joi = require('joi');
let {
  Types: { ObjectId },
} = require('mongoose');
// const { v4: uuidv4 } = require('uuid');
const userModel = require('./user.model');
const Generator = require('id-generator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const multer = require('multer');
const shortId = require('shortid');
const { createAvatar } = require('../helpers/avatar.constructor');
const { UnauthorizedError } = require('../helpers/errors.constructor');
const sgMail = require('@sendgrid/mail');

module.exports = {
  constructor() {
    this._costFactor = 7;
  },
  get addUser() {
    return this._addUser.bind(this);
  },

  get usersGet() {
    return this._usersGet.bind(this);
  },

  get usersGetByID() {
    return this._usersGetByID.bind(this);
  },

  get getCurrentUser() {
    return this._getCurrentUser.bind(this);
  },

  get updateUsersAllInfo() {
    return this._updateUsersAllInfo.bind(this);
  },
  get uploadsAvatar() {
    return this._uploadsAvatar.bind(this);
  },

  async _uploadsAvatar(req, res, next) {
    try {
      const storage = multer.diskStorage({
        destination: 'public/images',
        filename: (req, file, cb) => {
          const { name, ext } = path.parse(file.originalname);
          cb(null, name + '__' + shortId() + ext);
        },
      });
      const upload = multer({ storage: storage });
      return upload.single('avatar');
    } catch (err) {
      next(err);
    }
  },

  multerHandler() {
    const upload = multer();
    return upload.any();
  },

  async _updateUsersAllInfo(req, res, next) {
    try {
      const contactId = req.user.id;
      const newProperties = req.body;
      if (req.files.length) {
        const newAvatar = req.files[0].buffer;
        const avatarFileName = path.basename(req.user.avatarURL);
        const avatarPath = path.join(
          __dirname,
          `../public/images/${avatarFileName}`,
        );
        await fsPromises.writeFile(avatarPath, newAvatar);
      }

      await actions.findAndUpdate(contactId, newProperties);
      return res.status(200).json({
        avatarURL: req.user.avatarURL,
      });
    } catch (error) {
      next(error);
    }
  },

  async _addUser(req, res, next) {
    try {
      const { name, email, password, subscription } = req.body;
      const costFactor = 7;
      const passwordHash = await bcryptjs.hash(password, costFactor);

      const existingUser = await userModel.findUserByEmail(email);

      if (!existingUser) {
        const userAvatar = await createAvatar(email);
        const id = shortId();
        const avatarName = `${id}__${name}.png`;
        const avatarPath = path.join(
          __dirname,
          `../public/images/${avatarName}`,
        );
        await fsPromises.writeFile(avatarPath, userAvatar);
        const avatarURL = `http://localhost:3021/images/${avatarName}`;

        const user = await userModel.create({
          name,
          email,
          password: passwordHash,
          subscription,
          avatarURL,
        });

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: 1 * 10 * 5 * 10,
        });
        await userModel.updateToken(user._id, token);

        await this.sendVerificationEmail(user);

        return res.status(201).json({
          token,
          user: {
            email: user.email,
            subscription: user.subscription,
          },
        });
      } else {
        return res.status(400).json({
          message: 'Email in use',
        });
      }
    } catch (err) {
      next(err);
    }
  },

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);
      if (!user || user.status !== 'verified') {
        return res.status(400).json({ message: 'Неверный логин или пароль' });
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Неверный логин или пароль' });
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 1 * 10 * 5 * 10,
      });
      await userModel.updateToken(user._id, token);
      return res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  },

  async _usersGet(req, res, next) {
    try {
      const userFind = await userModel.find();
      return res.status(200).json(this.prepareUsersResponse(userFind));
    } catch (err) {
      next(err);
    }
  },

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
  },

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
  },

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
  },

  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.updateToken(user._id, null);
      return res.status(204).send();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized' });
    }
  },

  async _getCurrentUser(req, res, next) {
    try {
      const [userForResponse] = this.prepareUsersResponse([req.user]);
      return res.status(200).json(userForResponse);
    } catch (err) {
      res.status(401).json({ message: 'Not authorized' });
    }
  },

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization');
      const token = authorizationHeader.replace('Bearer ', '');
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError('Not authorized'));
      }

      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError('Not authorized');
      }
      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.params;
      const userToVerify = await userModel.findByVerificationToken(token);
      if (!userToVerify) {
        return res.status(404).json('User not found');
      }
      await userModel.verifyUser(userToVerify._id);
      return res.status(200).send('User');
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
    });
    const validationResult = Joi.validate(req.query, bodyRules);
    if (validationResult.error) {
      return res.status(400).json({ message: 'missing required name field' });
    }
    next();
  },

  validateSignIn(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = Joi.validate(req.query, signInRules);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }
    next();
  },

  prepareUsersResponse(users) {
    return users.map(user => {
      const { _id, email, password, subscription } = user;
      return { id: _id, email, password, subscription };
    });
  },

  async sendVerificationEmail(user) {
    // const verificationToken = uuidv4();
    var g = new Generator();
    const verificationToken = g.newId();
    await userModel.createVerificationToken(user._id, verificationToken);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: 'ceyechky@i.ua',
      from: 'ceyechky@gmail.com',
      subject: 'Email verification',
      text: 'HW 06: emailing with Node.js',
      html:
        '<a href="http://localhost:3021/users/auth/verify/${verificationToken}">please verify your email</a>',
    };

    function main() {
      const result = sgMail.send(msg);
      console.log(result);
    }
    await main();
  },
};
