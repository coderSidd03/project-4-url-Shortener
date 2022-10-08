//=====================Importing Module and Packages=====================//
const redis = require("redis");
const { promisify } = require("util");


//================================== connecting to redis ===========================================================================//
const redisClient = redis.createClient(
    19046,                                                                                          // port number 
    "redis-19046.c264.ap-south-1-1.ec2.cloud.redislabs.com",              
    { no_ready_check: true }
);                                                                                                  //endpoint
redisClient.auth("jaddtc8S5ZUESl9zEEPNVS2soOVSFykk", (err) => {  
    if (err) {
        console.log(err)
    };
});                                                                                                 // authentication of password
redisClient.on("connect", async () => { console.log(">> Connected to Redis.."); });                 // port listener


//====================== connecting setup for redis using get and set method ======================================================//

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);     // set function of redis
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);     // get function of redis
// const DEL_ASYNC = promisify(redisClient.DEL).bind(redisClient);     // del function of redis


//===================== Exporting functions ==========================//
module.exports = { SET_ASYNC, GET_ASYNC }