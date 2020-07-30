// set up app with express

const express = require("express");
const fs = require("fs");
const path = require("path");

// Make Express listen on port 3000
const app = express();
const PORT = 3000;

// Express is set up
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

// function for application to display notes given
app.get("/api/notes", function (req, res) {
    fs.readFile("db/db.json", "utf8", function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        res.json(notes);
    });
});

// new note is created
app.post("/api/notes", function (req, res) {
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    let id = randLetter + Date.now();
    let newNote = {
        id: id,
        title: req.body.title,
        text: req.body.text,
    };
    console.log(typeof notes);
    notes.push(newNote);
    const stringifyNote = JSON.stringify(notes);
    res.json(notes);
    fs.writeFile("db/db.json", stringifyNote, (err) => {
        if (err) console.log(err);
        else {
            console.log("Note successfully saved");
        }
    });
});




