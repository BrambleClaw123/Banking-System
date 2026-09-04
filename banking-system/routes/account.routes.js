const express = require('express');
const accountController = require('../controllers/account.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateBalanceSchema, getTransactionsSchema, transferSchema } = require('../validations/account.validation')

const router = express.Router();

router.get('/:id/balance', authMiddleware.verifyToken, authMiddleware.checkRole(["ADMIN", "USER", "STAFF"]), accountController.getAccountBalance);
router.post('/', authMiddleware.verifyToken, authMiddleware.checkRole(["ADMIN", "USER", "STAFF"]), accountController.create);
router.post('/deposit', validate(updateBalanceSchema, "body"), authMiddleware.verifyToken, authMiddleware.checkRole(["ADMIN", "STAFF"]), accountController.deposit);
router.post('/withdraw', validate(updateBalanceSchema, "body"), authMiddleware.verifyToken, authMiddleware.checkRole(["ADMIN", "STAFF"]), accountController.withdraw)
router.post('/transfer', validate(transferSchema, "body"), authMiddleware.verifyToken, authMiddleware.checkRole(["ADMIN", "STAFF", "USER"]), accountController.transfer);
router.get('/:id/transactions', validate(getTransactionsSchema, "query"), authMiddleware.verifyToken, authMiddleware.checkRole(["ADMIN", "STAFF", "USER"]), accountController.getTransactions);

module.exports = router;