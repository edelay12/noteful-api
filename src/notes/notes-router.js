const express = require('express')
const notesRouter = express.Router()
const NotesService = require('./notes-service')

const jsonParser = express.json()

notesRouter
  .route('/notes')
  .get((req, res, next) => {
NotesService.getAll(req.app.get('db'))
    .then( notes => {
        res.json(notes)
    })
    .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, content, foldernum} = req.body
    const newNote = { name , content, foldernum}

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(req.originalUrl) // +`/${note.id}`
          .json(note)
      })
      .catch(next)
  })




  notesRouter
  .route('/notes/:noteid') 
  .all((req, res, next) => {
    NotesService.getById(
    req.app.get('db'),
    req.params.noteid
    )
    .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
        res.json(res.note);
      })
   .delete((req, res, next) => {
        NotesService.deleteNote(
          req.app.get('db'),
          req.params.noteid
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })
    .patch(jsonParser, (req, res, next) => { 
        const { name, content, foldernum} = req.body
        const noteToUpdate = { name, content, foldernum }

        const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
          return res.status(400).json({
            error: {
              message: `Request body must contain all note fields (name, content, folder)`
            }
          })
    
        NotesService.updateNote(
          req.app.get('db'),
          req.params.noteid,
          noteToUpdate
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })

module.exports = notesRouter