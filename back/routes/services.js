var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth');
var { getServices, findServiceById, createService, updateService, deleteService } = require('../models/serviceModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Banho"
 *         description:
 *           type: string
 *           example: "Banho completo com produtos hipoalergênicos"
 *         price:
 *           type: number
 *           format: float
 *           example: 49.90
 */

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Listar todos os serviços
 *     description: Retorna todos os serviços cadastrados
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Service"
 *       500:
 *         description: Erro ao buscar serviços
 */
router.get('/', authenticateToken, function(req, res) {
    getServices((err, services) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar serviços' });
        res.status(200).json({ services: services });
    });
});

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Buscar serviço por ID
 *     description: Retorna os dados de um serviço específico
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 service:
 *                   $ref: "#/components/schemas/Service"
 *       404:
 *         description: Serviço não encontrado
 *       500:
 *         description: Erro ao buscar serviço
 */
router.get('/:id', authenticateToken, function(req, res) {
    findServiceById(req.params.id, (err, service) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar serviço' });
        if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });
        res.status(200).json({ service: service });
    });
});

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Criar novo serviço
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Service"
 *           example:
 *             name: "Tosa"
 *             description: "Tosa completa para cães"
 *             price: 79.90
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Serviço criado com sucesso"
 *                 service:
 *                   $ref: "#/components/schemas/Service"
 *       500:
 *         description: Erro ao criar serviço
 */
router.post('/', authenticateToken, function(req, res) {
    createService(req.body, (err, newService) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar serviço' });
        res.status(201).json({ message: 'Serviço criado com sucesso', service: newService });
    });
});

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Atualizar serviço
 *     description: Atualiza os dados de um serviço existente
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Service"
 *           example:
 *             name: "Banho Premium"
 *             description: "Banho com hidratação e perfume"
 *             price: 69.90
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       500:
 *         description: Erro ao atualizar serviço
 */
router.put('/:id', authenticateToken, function(req, res) {
    updateService(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar serviço' });
        res.status(200).json({ message: 'Serviço atualizado com sucesso' });
    });
});

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Deletar serviço
 *     description: Remove um serviço do sistema
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do serviço
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Serviço deletado com sucesso
 *       500:
 *         description: Erro ao deletar serviço
 */
router.delete('/:id', authenticateToken, function(req, res) {
    deleteService(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar serviço' });
        res.status(200).json({ message: 'Serviço deletado com sucesso' });
    });
});

module.exports = router;