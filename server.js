// set up app with express

const express = require("express");
const fs = require("fs");
const path = require("path");

// Make Express listen on port 3000
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
let notes = require("./db/db.json");

// server begins listening

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});

// create routes for html

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
