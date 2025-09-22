const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing.js");
const AppError = require("../utils/AppError.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.newFormRender = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.allListings = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  
    listing = await Listing.findById(id)
      .populate({ path: "Review", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const url = req.file.path;
  const filename = req.file.filename;
  if (!req.body.listing) {
    throw new AppError("Enter valid Information", 400);
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: url, filename: filename };
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};
module.exports.editListing = async (req, res) => {
  const { id } = req.params;

  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new AppError("Invalid ID format", 400);
  }
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  if (!id) {
    throw new AppError("Invalid ID format", 400);
  }
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

module.exports.searchedList =  async (req, res) => {
  let searchQuery = req.query.q;
  let listings = [];

  if (searchQuery) {
    listings = await Listing.find({
      title: { $regex: searchQuery, $options: "i" }
    });
  }

  res.render("listings/searchResults.ejs", { searchQuery, listings });
};
