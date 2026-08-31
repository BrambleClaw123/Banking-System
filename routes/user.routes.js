const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {registerSchema, loginSchema} = require('../validations/user.validation')
const {loginLimiter} = require('../middlewares/rateLimit.middleware')
const router = express.Router();

router.post('/', validate(registerSchema, "body"), userController.register);

router.post('/login', loginLimiter, validate(loginSchema, "body"), userController.login);

module.exports = router;