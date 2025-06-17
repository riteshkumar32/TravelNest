const Listing = require("./models/listing");
const {listingSchema} = require("./schema.js");
const ExpressError = require('./utils/ExpressError.js');
const {reviewSchema} = require("./schema.js");

// module.exports.isLoggedIn = (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     // Only store returnTo for GET requests
//     if (req.method === "GET") {
//       req.session.redirectUrl = req.originalUrl;
//     }
//     req.flash("error", "You must be logged in to perform this action!");
//     return res.redirect("/login");
//   }
//   next();
// };

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // Store redirectUrl for any method
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "You must be logged in to perform this action!");
    return res.redirect("/login");
  }
  next();
};




module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
  // @ts-ignore
    if (  !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const Review = require("./models/review");

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  // @ts-ignore
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to delete this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
