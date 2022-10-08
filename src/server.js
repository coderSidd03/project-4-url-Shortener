//=====================Importing Module and Packages=====================//
const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const route = require("./routes/route");

const app = express();


app.use(express.json());        // accepting data as json

app.use(cors());                // to not violate cors policy


//========== connecting mongoDB ============//
mongoose.connect("mongodb+srv://project4_urlshortner:UoRrmlJM7gch0SMz@cluster0.juqiop2.mongodb.net/group15_DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log(">> Database connected successfully.."))
    .catch(err => console.log(err))


//===== Global Middleware for Console the Date, Time, IP Address and Print the particular API Route Name when you will hit that API ========//
app.use(
    function checkDetails(req, res, next) {
        const dateTime = moment().format('YYYY-MM-DD hh:mm:ss a');
        console.log(`||--->> Date: ${dateTime}  ||--->> IP Address: ${req.ip}  ||--->> Route Called: ${req.originalUrl} ----- ||`);
        next();
    }
);

//===================== Global Middleware for All Route =====================//
app.use("/", route)


app.listen(PORT, () => { console.log(`>> Express app running on port ${PORT}..`) })
