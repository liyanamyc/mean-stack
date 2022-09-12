// hold express app
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();
mongoose.connect('mongodb+srv://<username>:<apikey>@cluster0.rvfaymd.mongodb.net/angular-node?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Failed to connect to database')
  })

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/images", express.static(path.join("backend/images")));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

  app.use("/api/posts", postsRoutes);

  module.exports = app;

// CORS
// Cross-Origin Resource Sharing
/*
CORS error : Happen when client and server listen to different host ports.
- need to set header on server side response
*/
