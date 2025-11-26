const db = require('../db/database');

// Buscar todos os agendamentos (com JOIN para trazer os nomes)
function getAgendamentos(callback) {
    const sql = `
        SELECT 
            appointments.*, 
            tutors.name as tutor_name, 
            pets.name as pet_name, 
            services.name as service_name
        FROM appointments
        LEFT JOIN tutors ON appointments.tutor_id = tutors.id
        LEFT JOIN pets ON appointments.pet_id = pets.id
        LEFT JOIN services ON appointments.service_id = services.id
    `;
    
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

// Buscar por ID
function findAgendamentoById(id, callback) {
    db.get('SELECT * FROM appointments WHERE id = ?', [id], (err, row) => {
        callback(err, row);
    });
}

// Criar
function createAgendamento(data, callback) {
    const { tutor_id, pet_id, service_id, date, status } = data;
    const sql = 'INSERT INTO appointments (tutor_id, pet_id, service_id, date, status) VALUES (?, ?, ?, ?, ?)';
    
    db.run(sql, [tutor_id, pet_id, service_id, date, status], function(err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID, ...data });
    });
}

// Atualizar
function updateAgendamento(id, data, callback) {
    const { tutor_id, pet_id, service_id, date, status } = data;
    const sql = 'UPDATE appointments SET tutor_id = ?, pet_id = ?, service_id = ?, date = ?, status = ? WHERE id = ?';
    
    db.run(sql, [tutor_id, pet_id, service_id, date, status, id], (err) => {
        callback(err);
    });
}

// Deletar
function deleteAgendamento(id, callback) {
    db.run('DELETE FROM appointments WHERE id = ?', [id], (err) => {
        callback(err);
    });
}

module.exports = { getAgendamentos, findAgendamentoById, createAgendamento, updateAgendamento, deleteAgendamento };