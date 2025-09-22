const Express = require("express");
const router = Express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const AppError = require("../utils/AppError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { listingSchema } = require("../schema.js");
const listingController = require("../controller/listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

const listingValidator = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }
  next();
};


router.route("/")
.get(wrapAsync(listingController.allListings))
.post(isLoggedIn,upload.single('listing[image][url]'), listingValidator,wrapAsync(listingController.createListing));


//new route
router.get("/new", isLoggedIn, listingController.newFormRender);
router.get("/search", wrapAsync(listingController.searchedList));


router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image][url]'),
  listingValidator,
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  listingValidator,
  wrapAsync(listingController.deleteListing)
);


//update route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

module.exports = router;
