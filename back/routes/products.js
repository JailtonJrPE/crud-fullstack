var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth');
var { getProducts, findProductById, createProduct, updateProduct, deleteProduct } = require('../models/productModel');

/* GET products listing. */
router.get('/', authenticateToken, function(req, res) {
    getProducts((err, products) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar produtos' });
        res.status(200).json({ products: products });
    });
});

/* GET product by ID */
router.get('/:id', authenticateToken, function(req, res) {
    findProductById(req.params.id, (err, product) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar produto' });
        if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
        res.status(200).json({ product: product });
    });
});

/* POST create product */
router.post('/', authenticateToken, function(req, res) {
    createProduct(req.body, (err, newProduct) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar produto' });
        res.status(201).json({ message: 'Produto criado com sucesso', product: newProduct });
    });
});

/* PUT update product */
router.put('/:id', authenticateToken, function(req, res) {
    updateProduct(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar produto' });
        res.status(200).json({ message: 'Produto atualizado com sucesso' });
    });
});

/* DELETE product */
router.delete('/:id', authenticateToken, function(req, res) {
    deleteProduct(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar produto' });
        res.status(200).json({ message: 'Produto deletado com sucesso' });
    });
});

module.exports = router;