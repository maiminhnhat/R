const express = require("express");
const router = express.Router();
var Property = require("../../models/Property");
router.get("/home", (req, res) => {
  var url = req.originalUrl;
  var main = "home/main-home";
  //lấy toàn bộ property
  Property.find()
  .exec((err, data) => {
    var unique = data.filter(a =>a.category=="4")
    var hotel = data.filter(a =>a.category=="2")
    var house = data.filter(a =>a.category=="3")
    var flat = data.filter(a =>a.category=="1")
   res.render("guest/index", { main: main, url: url, unique:unique, house: house, flat: flat, hotel: hotel});  
  });
  
});

module.exports = router;
