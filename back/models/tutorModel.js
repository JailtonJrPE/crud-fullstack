const db = require('../db/database');

// Buscar todos os tutores com os nomes dos seus pets
function getTutors(callback) {
    const sql = `
        SELECT tutors.*, GROUP_CONCAT(pets.name, ', ') as pets_names
        FROM tutors
        LEFT JOIN pets ON tutors.id = pets.tutor_id
        GROUP BY tutors.id
    `;
    
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

// Buscar tutor por ID
function findTutorById(id, callback) {
    db.get('SELECT * FROM tutors WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

// Criar tutor
function createTutor(tutor, callback) {
    const { name, contact, address } = tutor;
    db.run('INSERT INTO tutors (name, contact, address) VALUES (?, ?, ?)', [name, contact, address], function(err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, ...tutor });
    });
}

// Atualizar tutor
function updateTutor(id, tutor, callback) {
    const { name, contact, address } = tutor;
    db.run('UPDATE tutors SET name = ?, contact = ?, address = ? WHERE id = ?', [name, contact, address, id], (err) => {
        callback(err);
    });
}

// Deletar tutor
function deleteTutor(id, callback) {
    db.run('DELETE FROM tutors WHERE id = ?', [id], (err) => {
        callback(err);
    });
}

module.exports = { getTutors, findTutorById, createTutor, updateTutor, deleteTutor };