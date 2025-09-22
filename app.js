// ---------- Environment ----------
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ---------- Modules ----------
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const User = require("./models/user");
const AppError = require("./utils/AppError.js");
const engine = require("ejs-mate");

// ---------- Routes ----------
const listingRoutes = require("./routes/listing.js");
const reviewsRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");

// ---------- Database ----------
const dburl = process.env.ATLASDB_URL ;
async function main() {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to DB");
  } catch (err) {
    console.error("DB connection error:", err);
  }
}
main();

// ---------- Middleware ----------
app.use(cookieParser("mysecretcode"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store =MongoStore.create({
  mongoUrl : dburl,
  crypto:{
  secret: process.env.SECRET,
  },
  touchAfter : 24 * 3600 ,
});
store.on("err",()=>{
  console.log("error at connection between session and db ")
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
};
app.use(session(sessionOptions));
app.use(flash());

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Passport ----------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------- Flash & Current User ----------
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.curUser = req.user;
  next();
});

// ---------- Routes ----------
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => res.redirect("/listings"));

app.get("/test-flash", (req, res) => {
  req.flash("success", "Test flash message!");
  res.redirect("/listings");
});

// ---------- Error Handlers ----------
app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { statusCode, message });
});

// ---------- Start Server ----------
app.listen(9000, () => {
  console.log("Server is listening on port 9000");
});
