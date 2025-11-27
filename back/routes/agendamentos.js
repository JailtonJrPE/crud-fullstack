var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth');
var { getAgendamentos, findAgendamentoById, createAgendamento, updateAgendamento, deleteAgendamento } = require('../models/agendamentoModel');

/* GET lista */
router.get('/', authenticateToken, function(req, res) {
    getAgendamentos((err, agendamentos) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
        res.status(200).json({ agendamentos: agendamentos });
    });
});

/* GET unitário */
router.get('/:id', authenticateToken, function(req, res) {
    findAgendamentoById(req.params.id, (err, agendamento) => {
        if (err) return res.status(500).json({ error: 'Erro no banco' });
        if (!agendamento) return res.status(404).json({ error: 'Agendamento não encontrado' });
        res.status(200).json({ agendamento: agendamento });
    });
});

/* POST criar */
router.post('/', authenticateToken, function(req, res) {
    createAgendamento(req.body, (err, newAgendamento) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar agendamento' });
        res.status(201).json({ message: 'Agendamento criado', agendamento: newAgendamento });
    });
});

/* PUT atualizar */
router.put('/:id', authenticateToken, function(req, res) {
    updateAgendamento(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar' });
        res.status(200).json({ message: 'Agendamento atualizado' });
    });
});

/* DELETE deletar */
router.delete('/:id', authenticateToken, function(req, res) {
    deleteAgendamento(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar' });
        res.status(200).json({ message: 'Agendamento deletado' });
    });
});

module.exports = router;