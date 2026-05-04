const app = require('express')
const router = app.Router()
const { sendMail, sendFancyMail } = require('./Controller')

router.post('/sendmail', sendMail)
router.post('/sendfancymail', sendFancyMail)
module.exports = router