//=====================Importing Module and Packages=====================//
const axios = require("axios")
var shortId = require("shortid")
const urlModel = require("../models/urlModel")
const { checkString, checkInputsPresent } = require('../validations/validator')
const { SET_ASYNC, GET_ASYNC } = require("../redis/redis")


//================================== create short url ====================================<<< /url/shorten >>>//
const createShortUrl = async (req, res) => {
    try {
        let body = req.body;

        let { longUrl, ...rest } = body;                 // destructuring url body data

        // >>>> checking mandatory field =====================================================================//
        if (!checkInputsPresent(body)) return res.status(400).send({ status: false, message: "Please provide data in request body" });
        if (!longUrl) return res.status(400).send({ status: false, message: "please provide longUrl in body" });
        if (checkInputsPresent(rest)) return res.status(400).send({ status: false, message: "please provide only longUrl." });

        // >>>> invalid format of longUrl(not non-empty string) ==============================================//
        if (!checkString(longUrl)) return res.status(400).send({ status: false, message: "longUrl format is not valid" });


        // >>>> checking data present in cache (we've used redis) =============================================//
        const cachedData = await GET_ASYNC(`${longUrl}`)
        if (cachedData) return res.status(200).send({ status: true, message: "data from cache..", data: JSON.parse(cachedData) })

        // >>>> checking if longUrl is not a correct working link =============================================//
        let correctLink = false
        await axios.get(longUrl)
            .then((res) => {
                if (res.status == 200 || res.status == 201)
                    correctLink = true
            })
            .catch((error) => {
                correctLink = false
            })

        if (correctLink == false) return res.status(400).send({ status: false, message: `provided url: ${longUrl} in not live(working) till now !!!!` });


        // >>>> if data already in db =========================================================================//
        const isUrlPresent = await urlModel.findOne({ longUrl: longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 })

        if (isUrlPresent) {
            //x=== converting JS object to JSON string then store or set URL data in cache memory ==x//
            await SET_ASYNC(`${longUrl}`, JSON.stringify(duplicateUrl), `EX`, 60 * 10)
            return res.status(200).send({ status: true, msg: "longUrl already exists in DB", data: isUrlPresent })
        }

        // >>>> generating urlCode and shortUrl & adding them in body ========================================//
        const baseUrl = "http://localhost:3000/";
        body.urlCode = shortId.generate().toLowerCase();
        body.shortUrl = `${baseUrl}${body.urlCode}`;
        console.log(shortUrl);

        // >>>> creating data ================================================================================//
        const createData = await urlModel.create(body)

        let data = {
            longUrl: createData.longUrl,
            shortUrl: createData.shortUrl,
            urlCode: createData.urlCode
        }

        await SET_ASYNC(`${longUrl}`, JSON.stringify(data), `EX`, 60 * 10)                  // setting data into cache after creating a resource
        return res.status(201).send({ status: true, data: data })

    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
}



//================================== redirecting to the longurl ====================================<<< /:urlCode >>>//
const redirectUrl = async function (req, res) {
    try {
        const urlCode = req.params.urlCode;

        // >>>> invalid urlCode ==========================================================================//
        if (!shortId.checkString(urlCode)) return res.status(400).send({ status: false, message: `Invalid urlCode: ${urlCode} provided` })

        // >>>> redirecting using cache (if data present in cache) =======================================//
        let cachedURLCode = await GET_ASYNC(`${urlCode}`)
        if (cachedURLCode) return res.status(302).redirect(cachedURLCode);

        else {
            // >>>> if urlCode does not exist in cache then trying to fetch from db ======================//
            const isData = await urlModel.findOne({ urlCode: urlCode });
            if (!isData) return res.status(404).send({ status: false, message: "this urlCode is not present in our database" });

            await SET_ASYNC(`${urlCode}`, JSON.stringify(isData.longUrl), `EX`, 60 * 10);

            // >>>> redirecting to the longUrl ===========================================================//
            return res.status(302).redirect(isData.longUrl)                  //302 redirect status response
        }
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
}



module.exports = { createShortUrl, redirectUrl }