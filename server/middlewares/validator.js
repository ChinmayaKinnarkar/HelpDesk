// validator for Login Form
exports.login = function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.status(400).end("Please enter a valid email and password...");
    } else {
        next();
    }
}

//Validator For Signup form
exports.signup = function (req, res, next) {
    console.log("This is a signup validation");
    if (!req.body.name || !req.body.email || !req.body.mobileNumber || !req.body.password) {
        res.status(400).end("please fill all the forms");
    } else {
        console.log("this is a validation of Signup");
        next();
    }
}
