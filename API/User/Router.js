const app = require('express')
const router = app.Router()

const { accCreation, login, getAllUsers, getUserByEmail, getUserByContact, verifyOTP } = require('./Controller')
const authentication = require('../middleware/authentication')

router.post('/create-account', accCreation)
// Payload for creation
// {
//     "username": "username",
//     "password": "password",
//     "email": "email",
//     "address": "address",
//     "contact": "contact"
// }

router.post('/login', login)
// Payload for login
// {
//     "email": "email",
//     "password": "password"
// }

router.post('/verify-otp', verifyOTP);
router.get('/get-all-users', authentication(['admin']), getAllUsers)
router.get('/get-user-by-email', authentication(['admin']), getUserByEmail)
router.get('/get-user-by-contact/:contact', authentication(['admin']), getUserByContact)

module.exports = router