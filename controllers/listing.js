const Listing = require("../models/listing");


//Index Route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};


//New Form Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


//Show Route
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  // If the id is not a valid MongoDB ObjectId, redirect or show error
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   req.flash("error", "Invalid listing ID.");
  //   return res.redirect("/listings");
  // }
  const listing = await Listing.findById(id)
  .populate({
    path:"reviews",
    populate:{
      path:"author",
    },
  })
  .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }
  // console.log(listing);
  res.render("listings/show.ejs", { listing });
};




//Create Route
module.exports.createListing = (async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url,filename);

  const newListing = new Listing(req.body.listing);
  //  @type {import("mongoose").Document & { owner: { username: string } }} 
  // @ts-ignore
  newListing.owner = req.user._id;
  // @ts-ignore
  newListing.image = { url,filename};
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
});


// Edit route
module.exports.EditListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
// @ts-ignore
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};


//Update Route
module.exports.UpdateListing  =  async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if( typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
// @ts-ignore
    listing.image = { url , filename };
//  @ts-ignore
    await listing.save();
  }

  req.flash("success","Listing Updated");
  res.redirect(`/listings/${id}`);
  
};



//Delete Route
module.exports.DeleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
//   console.log(deletedListing);
  res.redirect("/listings");
};



