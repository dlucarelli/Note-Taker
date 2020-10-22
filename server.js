const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 8080;

let notesArray = []

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", function(err, data) {
        if(err) {
            throw err
        }
        return res.json(JSON.parse(data))
    });
})

app.post("/api/notes", function(req, res) {
    notesArray.push(req.body);
    fs.writeFile("./db/db.json", JSON.stringify(notesArray), function(err) {
        if(err) {
            throw err
        };
        return res.json(req.body);
    });
    console.log(notesArray);

});

// app.delete()


// /api/notes/:id
//req.params.id


app.listen(PORT, function () {
    console.log("Successfully running on Port: " + PORT)
})