const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.addReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.Review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${listing.id}`); // Redirect to the listing's show page
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const listing = await Listing.findById(id);

  listing.Review.pull(reviewId);
  await listing.save();
  const deleteReview = await Review.findByIdAndDelete(reviewId);
  console.log(deleteReview);
  await listing.save();
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
