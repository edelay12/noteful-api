const express = require('express')
const foldersRouter = express.Router()
const FoldersService = require('./folders-service')

const jsonParser = express.json()


foldersRouter
  .route('/folders')

  .get((req, res, next) => {
FoldersService.getAll(req.app.get('db'))
    .then( folders => {
        res.json(folders)
    })
    .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
      const { name } = req.body;
      const newFolder = { name }

      for (const [key, value] of Object.entries(newFolder)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
          })
        }
      }

      FoldersService.insertFolder(
        req.app.get('db'),
        newFolder
      )
        .then(folder => {
         
          res
            .status(201)
            
            .location(req.originalUrl+`/${folder.id}`)
            .json(folder)
        })
        .catch(next)
  })





  foldersRouter
  .route('/folders/:folderid') 
  .all((req, res, next) => {
     FoldersService.getById(
        req.app.get('db'),
        req.params.folderid
        )
        .then(folder => {
            if (!folder) {
              return res.status(404).json({
                error: { message: `Folder doesn't exist` }
              })
            }
            res.folder = folder
            next()
          })
          .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.folder)
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(
        req.app.get('db'),
        req.params.folderid
    )
    .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
      const { name } = req.body;
      const folderToUpdate = { name }

      const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
      if (numberOfValues === 0)
        return res.status(400).json({
          error: {
            message: `Request body must contain all note fields (name, content, folder)`
          }
        })

        FoldersService.updateFolder(
            req.app.get('db'),
            req.params.folderid,
            folderToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
  })


module.exports = foldersRouter



