const db = require('../db/database')

// Pegar pet pelo ID
function findPetById(id, callback){
    db.get('SELECT * FROM pets WHERE id = ?', [id], (err, row)=>{
        callback(err, row)
    })
}

// Pegar todos os pets (Trazendo o ID do tutor)
function getPets(callback){
    // Futuramente você pode fazer um JOIN aqui para trazer o nome do Tutor
    db.all('SELECT * FROM pets', [], (err, rows)=>{
        callback(err, rows)
    })
}

// Buscar pets por ID do Tutor
function findPetsByTutorId(tutorId, callback){
    db.all('SELECT * FROM pets WHERE tutor_id = ?', [tutorId], (err, rows)=>{
        callback(err, rows)
    })
}

// Criar pet (Atualizado: name, species, breed, age, tutor_id)
function createPet(pet, callback){
    const { name, species, breed, age, tutor_id } = pet;
    
    db.run(
        'INSERT INTO pets (name, species, breed, age, tutor_id) VALUES (?, ?, ?, ?, ?)',
        [name, species, breed, age, tutor_id], 
        function(err) {
            if(err){
                console.error('Erro ao inserir pet:', err.message)
                return callback(err)
            }
            callback(null, { id: this.lastID, ...pet })
        }
    )
}

function deletePet(id, callback){
    db.run('DELETE FROM pets WHERE id = ?', [id], (err)=>{
        if(err){
            console.error('Erro ao deletar pet:', err.message)
            return callback(err)
        }
        callback(null)
    })
}

// Atualizar pet (Atualizado)
function updatePet(id, pet, callback){
    const { name, species, breed, age, tutor_id } = pet;

    db.run(
        'UPDATE pets SET name = ?, species = ?, breed = ?, age = ?, tutor_id = ? WHERE id = ?',
        [name, species, breed, age, tutor_id, id],
        (err)=>{
            if(err){
                console.error('Erro ao atualizar pet:', err.message)
                return callback(err)
            }
            callback(null)
        }
    )
}

module.exports = { findPetById, createPet, getPets, deletePet, updatePet, findPetsByTutorId }