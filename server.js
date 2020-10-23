const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 8080;

let notesArray = []

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db.json")
    )
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.post("/api/notes", function(req, res) {
    let savedNote = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let noteId = (savedNote.length).toString();
    newNote.id = noteId;
    savedNote.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNote));
    res.json(savedNote);
});

app.get("/api/notes/:id", function(req, res) {
    let savedNote = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNote[Number(req.params.id)]); 
});

app.delete("/api/notes/:id", function(req, res) {
    let savedNote = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNote = savedNote.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNote) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNote));
    res.json(savedNote);
});

app.listen(PORT, function (err) {
    if(err) console.log(err);
    console.log("Successfully running on Port: " + PORT)
});