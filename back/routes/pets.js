var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth')
var {findPetById, createPet, getPets, deletePet, updatePet} = require('../models/petModel')



 /**
 * @swagger
 * /pets:
 *   get:
 *     summary: Listar todos os pets
 *     description: Retorna uma lista com todos os pets cadastrados no sistema
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pets recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Bella"
 *                       species:
 *                         type: string
 *                         example: "Cachorro"
 *                       age:
 *                         type: integer
 *                         example: 5
 *                       breed:
 *                         type: string
 *                         example: "Golden Retriever"
 *       500:
 *         description: Erro ao buscar pets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar pets"
 */
router.get('/', authenticateToken, function(req, res, next) {
  getPets((err, pets)=>{
    if(err){
      console.error('getPets erro:', err.message)
      return res.status(500).json({error: 'Erro ao buscar pets'})
    }

    return res.status(200).json({pets: pets})
  })
});

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Buscar pet por ID
 *     description: Retorna os dados de um pet específico pelo seu ID
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Pet encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pet:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Bella"
 *                     species:
 *                       type: string
 *                       example: "Cachorro"
 *                     age:
 *                       type: integer
 *                       example: 5
 *                     breed:
 *                       type: string
 *                       example: "Golden Retriever"
 *       404:
 *         description: Pet não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pet não encontrado"
 *       500:
 *         description: Erro ao buscar pet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar pet"
 */
router.get('/:id', authenticateToken, function(req, res, next) {
  const id = req.params.id
  findPetById(id, (err, pet)=>{
    if(err){
      console.error('findPetById erro:', err.message)
      return res.status(500).json({error: 'Erro ao buscar pet'})
    }

    if(!pet){
      return res.status(404).json({error: 'Pet não encontrado'})
    }

    return res.status(200).json({pet: pet})
  })
});

/**
 * @swagger
 * /pets/tutor/{id}:
 *   get:
 *     summary: Listar pets de um tutor específico
 *     description: Retorna todos os pets associados a um tutor específico
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do tutor
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Lista de pets do tutor recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Bella"
 *                       species:
 *                         type: string
 *                         example: "Cachorro"
 *                       age:
 *                         type: integer
 *                         example: 5
 *                       breed:
 *                         type: string
 *                         example: "Golden Retriever"
 *       500:
 *         description: Erro ao buscar pets do tutor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar pets"
 */
router.get('/tutor/:id', authenticateToken, function(req, res, next) {
  const tutorId = req.params.id
  
  findPetsByTutorId(tutorId, (err, pets)=>{
    if(err){
      console.error('Erro ao buscar pets do tutor:', err.message)
      return res.status(500).json({error: 'Erro ao buscar pets'})
    }
    return res.status(200).json({pets: pets})
  })
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Criar novo pet
 *     description: Cria um novo pet no sistema
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - age
 *               - breed
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bella"
 *               species:
 *                 type: string
 *                 example: "Cachorro"
 *               age:
 *                 type: integer
 *                 example: 5
 *               breed:
 *                 type: string
 *                 example: "Golden Retriever"
 *     responses:
 *       201:
 *         description: Pet criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pet criado com sucesso"
 *                 pet:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Bella"
 *                     species:
 *                       type: string
 *                       example: "Cachorro"
 *                     age:
 *                       type: integer
 *                       example: 5
 *                     breed:
 *                       type: string
 *                       example: "Golden Retriever"
 *       500:
 *         description: Erro ao salvar pet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao salvar pet"
 */
router.post('/', authenticateToken, function(req, res, next) {
  // Agora passamos o corpo inteiro (req.body) para o model
  // Isso permite enviar { name, species, age, breed... } tudo de uma vez
  const petData = req.body;

  console.log('Tentando criar pet:', petData)

  createPet(petData, (err, newPet)=>{
    if(err){
      console.error('createPet erro:', err.message)
      return res.status(500).json({error: 'Erro ao salvar pet'})
    }

    return res.status(201).json({message: 'Pet criado com sucesso', pet: newPet})
  })
});

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Deletar pet
 *     description: Remove um pet do sistema
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser deletado
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Pet deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pet deletado com sucesso"
 *       500:
 *         description: Erro ao deletar pet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao deletar pet"
 */
router.delete('/:id', authenticateToken, function(req, res){
  const id = req.params.id
  deletePet(id, (err)=>{
    if(err){
      console.error('deletePet erro:', err.message)
      return res.status(500).json({error: 'Erro ao deletar pet'})
    }

    return res.status(200).json({message: 'Pet deletado com sucesso'})
  })
})

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Atualizar pet
 *     description: Atualiza os dados de um pet existente
 *     tags:
 *       - Pets
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pet a ser atualizado
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bella"
 *               species:
 *                 type: string
 *                 example: "Cachorro"
 *               age:
 *                 type: integer
 *                 example: 5
 *               breed:
 *                 type: string
 *                 example: "Golden Retriever"
 *     responses:
 *       200:
 *         description: Pet atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pet atualizado com sucesso"
 *       500:
 *         description: Erro ao atualizar pet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar pet"
 */
router.put('/:id', authenticateToken, function(req, res){
  const id = req.params.id
  const petData = req.body

  updatePet(id, petData, (err)=>{
    if(err){
      console.error('updatePet erro:', err.message)
      return res.status(500).json({error: 'Erro ao atualizar pet'})
    }

    return res.status(200).json({message: 'Pet atualizado com sucesso'})
  })
})

module.exports = router;