// set up app with express

const express = require("express");
const fs = require("fs");
const path = require("path");

// Make Express listen on port 3000
const app = express();
const PORT = process.env.PORT || 3000;

// Express is set up
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
let notes = require("./db/db.json");

// server begins listening
app.listen(PORT, function () {
    console.log(`App is running on port ${ PORT }`);
});

// create routes for html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// for heroku deployment
app.get("/", function(req, res) {
    res.json(path.join(__dirname, "public/index.html"));
});

// routes db.json to the html page
app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
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
app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved successfully to db.json. Content: ", newNote);
    res.json(savedNotes);
})

// allows user to delete saved notes
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })

    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})



// new note is created
// app.post("/api/notes", function (req, res) {
//     let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
//     let id = randLetter + Date.now();
//     let newNote = {
//         id: id,
//         title: req.body.title,
//         text: req.body.text,
//     };
//     console.log(typeof notes);
//     notes.push(newNote);
//     const stringifyNote = JSON.stringify(notes);
//     res.json(notes);
//     fs.writeFile("db/db.json", stringifyNote, (err) => {
//         if (err) console.log(err);
//         else {
//             console.log("Note successfully saved");
//         }
//     });
// });

// // if user would like to delete note:
// app.delete("/api/notes/:id", function (req, res) {
//     let noteID= req.params.id;
//     fs.readFile("db/db.json", "utf8", function (err, data) {
//         let updatedNotes = JSON.parse(data).filter((note) => {
//             console.log("note.id", note.id);
//             console.log("noteID", noteID);
//             return note.id !== noteID;
//         });
//         notes = updatedNotes;
//         const stringifyNote = JSON.stringify(updatedNotes);
//         fs.writeFile("db/db.json", stringifyNote, (err) => {
//             if (err) console.log(err);
//             else {
//                 console.log("Note deleted successfully");
//             }
//         });
//         res.json(stringifyNote);
//     });
// });


