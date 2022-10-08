//<<<================================= functions for Validation ===================================>>>//


//===================== Checking that there is something as Input =====================//
const checkInputsPresent  = (requestBody) => { return Object.keys(requestBody).length > 0 }


//============================== Validating the Input ================================//
const checkString  = function (value) {
    if (typeof value !== "string") return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}


//============================== exporting functions ================================//
module.exports = { checkString , checkInputsPresent  }