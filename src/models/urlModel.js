//====================== Importing Mongoose =======================//
const mongoose = require("mongoose")


//===================== Creating URL's Schema =====================//
const urlSchema = new mongoose.Schema({

    urlCode: { type: String, required: true, unique: true, lowercase: true, trim: true },

    longUrl: { type: String, required: true },

    shortUrl: { type: String, required: true, unique: true }

}, { timestamps: true })


//===================== exporting the schema ======================//
module.exports = mongoose.model('url', urlSchema);