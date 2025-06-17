const Listing = require( "../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    // Null check
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    const newReview = new Review(req.body.review);

    //  If TypeScript complains about `.author`, ignore or cast
    // @ts-ignore
    newReview.author = req.user._id;
  //@ts-ignore
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  };



  // delete route
  module.exports.DeleteReview=async(req,res) => {
      let { id, reviewId } = req.params;
  
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      await Review.findByIdAndDelete(reviewId);
  
      req.flash("success", "Review deleted!");
      res.redirect(`/listings/${id}`);
    };
