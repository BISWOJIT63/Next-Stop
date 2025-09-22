const { isRef } = require("joi");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to access this page.");
    return res.redirect("/login");
  }
  next();
};

module.exports.savedUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.curUser._id)) {
    req.flash(
      "error",
      "you must be the owner of this listing to access this page!"
    );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.curUser._id)) {
    req.flash("error", "you can't delete this");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.reviewValidator = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};
