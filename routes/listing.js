const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const {storage} = require("../cloudcofig.js");
const upload = multer({storage});


const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing }= require("../middleware.js");





//index route
router.get("/" , wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
    }));

//New Route
router.get("/new" , isLoggedIn, (req,res) => {
    
    res.render("listings/new.ejs" );

});

//show route
router.get("/:id" , wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate: {path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error" , " Listing Does not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});

}));

//create Route
router.post("/", isLoggedIn,upload.single("listing[image]") ,validateListing, wrapAsync(async (req, res, next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image={url , filename};
         await newListing.save();
        req.flash("success" , "New Listing Created!");
        res.redirect("/listings");   
}));

//edit Route
router.get("/:id/edit" ,isLoggedIn, isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , " Listing Does not Exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}));

//update Route
router.put("/:id" ,  isLoggedIn, isOwner, validateListing ,wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let listing =await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing});
    req.flash("success" , " Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id" , isLoggedIn,isOwner, wrapAsync(async (req,res) => {
    let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   req.flash("success" , "Listing Deleted");
   console.log(deletedListing);
   res.redirect("/listings");
}));


module.exports = router;
