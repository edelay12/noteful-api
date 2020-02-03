require('dotenv').config()
const knex = require('knex')
const folderService = require('./folder-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})