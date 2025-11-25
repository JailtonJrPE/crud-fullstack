var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth');
var { getServices, findServiceById, createService, updateService, deleteService } = require('../models/serviceModel');

/* GET services listing. */
router.get('/', authenticateToken, function(req, res) {
    getServices((err, services) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar serviços' });
        res.status(200).json({ services: services });
    });
});

/* GET service by ID */
router.get('/:id', authenticateToken, function(req, res) {
    findServiceById(req.params.id, (err, service) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar serviço' });
        if (!service) return res.status(404).json({ error: 'Serviço não encontrado' });
        res.status(200).json({ service: service });
    });
});

/* POST create service */
router.post('/', authenticateToken, function(req, res) {
    createService(req.body, (err, newService) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar serviço' });
        res.status(201).json({ message: 'Serviço criado com sucesso', service: newService });
    });
});

/* PUT update service */
router.put('/:id', authenticateToken, function(req, res) {
    updateService(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar serviço' });
        res.status(200).json({ message: 'Serviço atualizado com sucesso' });
    });
});

/* DELETE service */
router.delete('/:id', authenticateToken, function(req, res) {
    deleteService(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar serviço' });
        res.status(200).json({ message: 'Serviço deletado com sucesso' });
    });
});

module.exports = router;