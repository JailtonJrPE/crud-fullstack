// Arquivo: back/models/serviceModel.js

const db = require('../db/database')

// Pegar serviço pelo ID
function findServiceById(id, callback){
    db.get('SELECT * FROM services WHERE id = ?', [id], (err, row)=>{
        callback(err, row)
    })
}

// Pegar todos os serviços
function getServices(callback){
    db.all('SELECT * FROM services', [], (err, rows)=>{
        callback(err, rows)
    })
}

// Criar serviço (name, description, price)
function createService(service, callback){
    const { name, description, price } = service;
    
    db.run(
        'INSERT INTO services (name, description, price) VALUES (?, ?, ?)',
        [name, description, price], 
        function(err) {
            if(err){
                console.error('Erro ao inserir serviço:', err.message)
                return callback(err)
            }
            callback(null, { id: this.lastID, ...service })
        }
    )
}

// Deletar serviço
function deleteService(id, callback){
    db.run('DELETE FROM services WHERE id = ?', [id], (err)=>{
        if(err){
            console.error('Erro ao deletar serviço:', err.message)
            return callback(err)
        }
        callback(null)
    })
}

// Atualizar serviço
function updateService(id, service, callback){
    const { name, description, price } = service;

    db.run(
        'UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?',
        [name, description, price, id],
        (err)=>{
            if(err){
                console.error('Erro ao atualizar serviço:', err.message)
                return callback(err)
            }
            callback(null)
        }
    )
}

module.exports = { findServiceById, createService, getServices, deleteService, updateService }