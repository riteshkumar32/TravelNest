const express = require("express");
const router = express.Router( {mergeParams: true});
const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Schema = mongoose.Schema;
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); 
// const upload = multer( { dest : 'uploads/'});  // to save the file temporarily
const upload = multer( {storage} );  // to save the data in cloudinary storage


const ListingController = require("../controllers/listing.js");

//Index Route
router.get("/", wrapAsync( ListingController.index));

//New Route
router.get("/new",isLoggedIn,ListingController.renderNewForm);

// Show Route
// router.get("/:id", async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id).populate("reviews");
//   res.render("listings/show.ejs", { listing });
// });


//Show Route
router.get("/:id",wrapAsync(ListingController.showListing) );

//Create Route
// router.post("/",isLoggedIn,validateListing,(ListingController.createListing));
router.post("/", 
  isLoggedIn, 
  upload.single('listing[image]'), 
  validateListing, 
  wrapAsync(ListingController.createListing)
);


//Edit Route
router.get("/:id/edit",isLoggedIn, upload.single('listing[image]'), isOwner,wrapAsync(ListingController.EditListing));

//Update Route
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'), validateListing,wrapAsync(ListingController.UpdateListing));


//Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(ListingController.DeleteListing));


module.exports = router;