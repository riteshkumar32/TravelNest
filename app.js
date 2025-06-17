if( process.env.NODE_ENV != "production") {
require('dotenv').config();
}



const express = require("express");
const app = express();
const mongoose = require( "mongoose" );
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const flash = require("connect-flash");
const multer = require("multer");
const upload = multer( { dest : 'uploads/'});  // to save the file temporarily



// Using Routers ( Express router)
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");
const { error } = require('console');

// const dbUrl = 'mongodb://127.0.0.1:27017/wanderlust';
// grab from .env
const dbUrl = process.env.ATLASDB_URL;
// @ts-ignore
mongoose.connect(dbUrl)
  .then(() => {
    console.log("DB connected");
    app.listen(8080, () => console.log("Server on 8080"));
  })
  .catch(err => {
    console.error("DB connection error:", err);
  });




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// Add session middleware before flash

const store = MongoStore.create({
  mongoUrl: dbUrl,
  collectionName: 'sessions',
  crypto : {
    // @ts-ignore
    secret: process.env.SECRET,
  }, 
  // optional, defaults to 'sessions'
  touchAfter: 24 * 3600, // seconds
});


store.on("error",(err) =>{
  console.log("ERROR in MONGO SESSION STORE",err);
});




const sessionOptions = {
  store,
  secret: process.env.SECRET || 'aSecretKeyHere',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());






app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// @ts-ignore
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make flash messages accessible in all templates
app.use((req, res, next) => {
    res.locals.currUser = req.user; 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", (req, res) => {
  res.render("home");
});

main()
.then( ()=>{
    console.log("connected to DB");
})
.catch ( (err) =>{
    console.log(err);
})


async function main() {
  // @ts-ignore~
    await mongoose.connect(dbUrl);
}

app.listen( 8080 , () =>{
    console.log("server is listening on port 8080");

});



// If the route does not matches with any above defined route then this below page ( PAGE NOT  FIND) will be assigned
// Error handler for 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});


