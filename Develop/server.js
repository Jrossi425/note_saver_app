const express = require('express');
const path = require('path');
const { readFile, writeFile } = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// line that serves all of our front-end files statically
app.use(express.static('public'));

// these two lines grab the data from the front-end, turn it into a JSON object,
// and then add it to the req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTML route that should return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// API route that should read the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    readFile('./db/db.json', 'utf8').then((data) => {
        res.send(data);
        console.log(data);
    })
});

// API route that should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
app.post('/api/notes', (req, res) => {
    readFile('./db/db.json', 'utf8').then((data) => {
        const notes = JSON.parse(data)
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            id: uuidv4()
        }
        
        notes.push(newNote)
        writeFile('./db/db.json', JSON.stringify(notes))
        .then (()=> res.json(req.body))
    })
});

// BONUS POINTS ROUTE
// API route for deleting a note. Creates a new array of notes that does not include the note with the id that was passed in the request. Then writes the new array to the db.json file and returns the new array to the client.
app.delete('/api/notes/:id', (req, res) => {
    readFile('./db/db.json', 'utf8').then((data) => {
        const notes = JSON.parse(data)
        const newNotes = notes.filter((note) => note.id !== req.params.id)
        writeFile('./db/db.json', JSON.stringify(newNotes))
        .then (()=> res.json(req.body))
    })
});



// HTML route that should return the index.html file making sure that the Wildcard route comes last.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});





app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}!`));