const User = require("../models/user.js");



// signup
module.exports.renderSignupForm =  (req, res) => {
 res.render("users/signup.ejs");
};

module.exports.signup= async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to TravelNest!");
        res.redirect("/");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };







// login  
  module.exports.renderLoginForm = (req,res)=>{
  res.render("users/login.ejs");
};

 
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to TravelNest, You are logged in!");

    //Correct redirect logic here
    // @ts-ignore
    const redirectUrl = req.session.redirectUrl || "/";
    // @ts-ignore
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
  };




// logout
  module.exports.logout = (req,res,next)=>{
  req.logout((err) =>{
    if( err ) {
    return next(err);
    }
    req.flash("success","You are successfully logged out!");
    res.redirect("/")
  })
};
