const authenticator = function(req, res, next) {
    console.log("Authenticating...");
    next();
}

module.exports = authenticator;