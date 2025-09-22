const Express = require("express");
const router = Express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,reviewValidator,isAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");



//post review route
router.post("/",isLoggedIn, reviewValidator,wrapAsync(reviewController.addReview));


router.delete("/:reviewId", isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;