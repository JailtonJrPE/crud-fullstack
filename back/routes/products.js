var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth');
var { getProducts, findProductById, createProduct, updateProduct, deleteProduct } = require('../models/productModel');

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Operações relacionadas a produtos
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Camiseta"
 *         price:
 *           type: number
 *           format: float
 *           example: 49.9
 *         description:
 *           type: string
 *           example: "Camiseta 100% algodão"
 *         createdAt:
 *           type: string
 *           format: date-time
 *   responses:
 *     InternalError:
 *       description: Erro interno do servidor
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: string
 *                 example: "Erro interno"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/* GET products listing. */
router.get('/', authenticateToken, function(req, res) {
    getProducts((err, products) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar produtos' });
        res.status(200).json({ products: products });
    });
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/* GET product by ID */
router.get('/:id', authenticateToken, function(req, res) {
    findProductById(req.params.id, (err, product) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar produto' });
        if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
        res.status(200).json({ product: product });
    });
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/* POST create product */
router.post('/', authenticateToken, function(req, res) {
    createProduct(req.body, (err, newProduct) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar produto' });
        res.status(201).json({ message: 'Produto criado com sucesso', product: newProduct });
    });
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Camiseta"
 *               price:
 *                 type: number
 *                 example: 49.9
 *               description:
 *                 type: string
 *                 example: "Camiseta 100% algodão"
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/* PUT update product */
router.put('/:id', authenticateToken, function(req, res) {
    updateProduct(req.params.id, req.body, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar produto' });
        res.status(200).json({ message: 'Produto atualizado com sucesso' });
    });
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

/* DELETE product */
router.delete('/:id', authenticateToken, function(req, res) {
    deleteProduct(req.params.id, (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao deletar produto' });
        res.status(200).json({ message: 'Produto deletado com sucesso' });
    });
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Deleta um produto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto deletado
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

module.exports = router;