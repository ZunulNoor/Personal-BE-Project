const app = require('express')
const router = app.Router()

const { getMessage, sendMessage } = require('./Controller')


router.get("/get-message", getMessage)
router.post("/send-message", sendMessage)

module.exports = router