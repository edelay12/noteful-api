const NotesService = {
getAll(knex){
return knex.select('*').from('notes_table')
},
getById(knex, id){
    return knex
    .from('notes_table')
    .select('*')
    .where('id', id)
    .first()
},
insertNote(knex, note){
    return knex
    .insert(note)
    .into('notes_table')
    .returning('*')
    .then(rows => {
      return rows[0]
    })
},
deleteNote(knex, id){
    return knex('notes_table')
    .where('id', id)
    .delete()
},
updateNote(knex, id, updatedNote){
    return knex('notes_table')
        .where('id' , id)
        .update(updatedNote)
},
}

module.exports = NotesService