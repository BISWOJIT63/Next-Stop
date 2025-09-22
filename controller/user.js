const User = require("../models/user.js");
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
}

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body.user;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

      req.login(registeredUser,(err)=>{
        if(err){
              return next(err);
            }
            req.flash("success", "Welcome to the ROOTLY!");
            res.redirect("/listings");
      });
      
 } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back!");
    let curUrl = res.locals.redirectUrl || "/listings"
    res.redirect(curUrl);
  }

module.exports.logout = (req,res ,next) => {
     req.logout((err) =>{
      if(err){
       return next(err);
      }
      req.flash("success", "See you soon!");
      res.redirect("/listings");
     })
}

