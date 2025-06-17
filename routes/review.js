const express = require("express");
const router = express.Router( {mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require('../utils/ExpressError.js');
const Review = require("../models/review.js");
const {validateReview,isLoggedIn, validateListing,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");





// Review Route
// Post Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview));



// Delete Review
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.DeleteReview));

module.exports = router;