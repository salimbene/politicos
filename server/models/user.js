const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = new Schema({
  name: {
    type: String,
    uppercase: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlenght: 16,
    required: true,
    trim: true,
  },
  mail: {
    type: String,
    maxlenght: 255,
    lowercase: true,
    unique: true,
    trim: true,
  },
  isAdmin: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      mail: this.mail,
      isAdmin: this.isAdmin,
      isActive: this.isActive,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUserSchema(user) {
  const schema = {
    name: Joi.string().required(),
    password: Joi.string().required(),
    mail: Joi.string().required(),
    isActive: Joi.boolean(),
    isAdmin: Joi.boolean(),
  };

  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUserSchema;
