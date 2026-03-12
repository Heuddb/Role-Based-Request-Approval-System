const express = require('express');
const { sign_in, sign_up, sign_out } = require('../Controller/AuthController');
const { signUpValidation, signInValidation } = require('../Middleware/ExpressValidation');

const auth = express.Router();

auth.post('/signup', signUpValidation , sign_up)
auth.post('/signin',signInValidation ,sign_in)
auth.post('/signout', sign_out)

module.exports = auth;

