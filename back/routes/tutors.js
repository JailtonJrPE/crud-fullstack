var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth');
var { getTutors, findTutorById, createTutor, updateTutor, deleteTutor } = require('../models/tutorModel');

/**
 * @swagger
 * components:
 *   schemas:
 *     TutorInput:
 *       type: object
 *       required:
 *         - name
 *         - contact
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do tutor
 *         contact:
 *           type: string
 *           description: Telefone ou e-mail para contato
 *         address:
 *           type: string
 *           description: Endereço completo do tutor
 *       example:
 *         name: Maria Oliveira
 *         contact: 81 98765-4321
 *         address: Rua das Palmeiras, 200

 *     TutorOutput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         contact:
 *           type: string
 *         address:
 *           type: string
 *         pets:
 *           type: array
 *           description: Lista de pets associados ao tutor
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *       example:
 *         id: 1
 *         name: Maria Oliveira
 *         contact: 81 98765-4321
 *         address: Rua das Palmeiras, 200
 *         pets:
 *           - id: 10
 *             name: Thor
 *             species: Cachorro
 *           - id: 11
 *             name: Luna
 *             species: Gato
 */

/**
 * @swagger
 * tags:
 *   name: Tutors
 *   description: Gerenciamento de tutores
 */

/**
 * @swagger
 * /tutors:
 *   get:
 *     summary: Lista todos os tutores com seus pets associados
 *     tags: [Tutors]
 *     responses:
 *       200:
 *         description: Lista de tutores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tutors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TutorOutput'
 */

router.get('/', authenticateToken, function(req, res) {
    getTutors((err, tutors) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar tutores' });
        }
        res.status(200).json({ tutors: tutors });
    });
});

/**
 * @swagger
 * /tutors/{id}:
 *   get:
 *     summary: Busca um tutor pelo ID com seus pets associados
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Tutor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TutorOutput'
 */
router.get('/:id', authenticateToken, function(req, res) {
    findTutorById(req.params.id, (err, tutor) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar tutor' });
        if (!tutor) return res.status(404).json({ error: 'Tutor não encontrado' });
        res.status(200).json({ tutor: tutor });
    });
});

/**
 * @swagger
 * /tutors:
 *   post:
 *     summary: Cria um novo tutor (sem pets)
 *     tags: [Tutors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TutorInput'
 *     responses:
 *       201:
 *         description: Tutor criado com sucesso
 */
router.post('/', authenticateToken, function(req, res) {
    const tutorData = req.body;
    createTutor(tutorData, (err, newTutor) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar tutor' });
        res.status(201).json({ message: 'Tutor criado com sucesso', tutor: newTutor });
    });
});

/**
 * @swagger
 * /tutors/{id}:
 *   put:
 *     summary: Atualiza os dados de um tutor
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TutorInput'
 *     responses:
 *       200:
 *         description: Tutor atualizado
 */
router.put('/:id', authenticateToken, function(req, res) {
    const id = req.params.id;
    const tutorData = req.body;
    updateTutor(id, tutorData, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar tutor' });
        res.status(200).json({ message: 'Tutor atualizado com sucesso' });
    });
});

/**
 * @swagger
 * /tutors/{id}:
 *   delete:
 *     summary: Deleta um tutor
 *     tags: [Tutors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Tutor removido
 */
router.delete('/:id', authenticateToken, function(req, res) {
    deleteTutor(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar tutor' });
        res.status(200).json({ message: 'Tutor deletado com sucesso' });
    });
});

module.exports = router;