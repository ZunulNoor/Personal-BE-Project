const app = require('express')
const router = app.Router()

const { accCreation, login, getAllUsers, getUserByEmail, getUserByContact, verifyOTP } = require('./Controller')
const authentication = require('../middleware/authentication')
const { authRateLimiter } = require('../middleware/rateLimiter')

router.post('/create-account', authRateLimiter, accCreation)
// Payload for creation
// {
//     "username": "username",
//     "password": "password",
//     "email": "email",
//     "address": "address",
//     "country": "US",
//     "contact": "+11234567890"
// }

router.post('/login', authRateLimiter, login)
// Payload for login
// {
//     "email": "email",
//     "password": "password"
// }

router.post('/verify-otp', authRateLimiter, verifyOTP);
router.get('/get-all-users', authentication(['admin']), getAllUsers)
router.get('/get-user-by-email', authentication(['admin']), getUserByEmail)
router.get('/get-user-by-contact/:contact', authentication(['admin']), getUserByContact)

module.exports = router