const db = require('../db/database');

// Buscar todos os serviços
function getServices(callback) {
    db.all('SELECT * FROM services', [], (err, rows) => {
        callback(err, rows);
    });
}

// Buscar serviço por ID
function findServiceById(id, callback) {
    db.get('SELECT * FROM services WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

// Criar serviço
function createService(service, callback) {
    const { name, description, price } = service;
    db.run('INSERT INTO services (name, description, price) VALUES (?, ?, ?)', [name, description, price], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, { id: this.lastID, ...service });
    });
}

// Atualizar serviço
function updateService(id, service, callback) {
    const { name, description, price } = service;
    db.run('UPDATE services SET name = ?, description = ?, price = ? WHERE id = ?', [name, description, price, id], (err) => {
        callback(err);
    });
}

// Deletar serviço
function deleteService(id, callback) {
    db.run('DELETE FROM services WHERE id = ?', [id], (err) => {
        callback(err);
    });
}

module.exports = { getServices, findServiceById, createService, updateService, deleteService };