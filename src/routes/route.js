//=====================Importing Module and Packages=================================//
const express = require("express")
const router = express.Router()
const { createShortUrl, redirectUrl } = require("../controllers/urlController")


// ============================= create short url ===================================//
router.post("/url/shorten", createShortUrl)

//============================== get redirected url =================================//
router.get("/:urlCode", redirectUrl)


//============================== if invalid endpoint/route ==========================//
router.all("/**", (req, res) => { res.status(404).send({ status: 'Error', message: "The Path you are requesting is not available !!" }); })


//============================== exporting router ===================================//
module.exports = router