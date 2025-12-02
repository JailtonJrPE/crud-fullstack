var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth');
var { getAgendamentos, findAgendamentoById, createAgendamento, updateAgendamento, deleteAgendamento } = require('../models/agendamentoModel');
/**
 * @swagger
 * tags:
 *   name: Agendamentos
 *   description: CRUD de Agendamentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Agendamento:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         pet_id:
 *           type: integer
 *         tutor_id:
 *           type: integer
 *           description: Tutor selecionado automaticamente pelo backend com base no pet_id
 *         servico_id:
 *           type: integer
 *         data_hora:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [PENDENTE, CONFIRMADO, CANCELADO]

 *     AgendamentoCreate:
 *       type: object
 *       required:
 *         - pet_id
 *         - servico_id
 *         - data_hora
 *         - status
 *       properties:
 *         pet_id:
 *           type: integer
 *           description: ID do pet selecionado
 *         servico_id:
 *           type: integer
 *           description: Serviço escolhido no agendamento
 *         data_hora:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         status:
 *           type: string
 *           enum: [PENDENTE, CONFIRMADO, CANCELADO]
 *           description: Status do agendamento
 */

/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Agendamentos]
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 */
router.get('/', authenticateToken, function(req, res) {
    getAgendamentos((err, agendamentos) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
        res.status(200).json({ agendamentos: agendamentos });
    });
});

/**
 * @swagger
 * /agendamentos/{id}:
 *   get:
 *     summary: Busca um agendamento pelo ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 */
router.get('/:id', authenticateToken, function(req, res) {
    findAgendamentoById(req.params.id, (err, agendamento) => {
        if (err) return res.status(500).json({ error: 'Erro no banco' });
        if (!agendamento) return res.status(404).json({ error: 'Agendamento não encontrado' });
        res.status(200).json({ agendamento: agendamento });
    });
});

/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Cria um novo agendamento (tutor é selecionado automaticamente)
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendamentoCreate'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 */
router.post('/', authenticateToken, function(req, res) {
    createAgendamento(req.body, (err, newAgendamento) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar agendamento' });
        res.status(201).json({ message: 'Agendamento criado', agendamento: newAgendamento });
    });
});

/**
 * @swagger
 * /agendamentos/{id}:
 *   put:
 *     summary: Atualiza parcialmente um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: put
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendamentoCreate'
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 */
router.put('/:id', authenticateToken, function(req, res) {
    updateAgendamento(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar' });
        res.status(200).json({ message: 'Agendamento atualizado' });
    });
});

/**
 * @swagger
 * /agendamentos/{id}:
 *   delete:
 *     summary: Exclui um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento deletado
 */
router.delete('/:id', authenticateToken, function(req, res) {
    deleteAgendamento(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar' });
        res.status(200).json({ message: 'Agendamento deletado' });
    });
});

module.exports = router;