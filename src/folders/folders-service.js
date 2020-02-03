const FoldersService = {
    getAll(knex){
        return knex.select('*').from('folders_table')
        },
getById(knex, id){
            return knex
            .from('folders_table')
            .select('*')
            .where('id', id)
            .first()
        },
insertFolder(knex, folder){
    return knex
    .insert(folder)
    .into('folders_table')
    .returning('*')
    .then(rows => {
      return rows[0]
    })
},
deleteFolder(knex, id){
    return knex('folders_table')
    .where('id', id)
    .delete()
},
updateFolder(knex, id, updatedFolder){
    return knex('folders_table')
        .where('id' , id)
        .update(updatedFolder)
},
}

module.exports = FoldersService