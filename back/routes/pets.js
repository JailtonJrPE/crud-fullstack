var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth')
var {findPetById, createPet, getPets, deletePet, updatePet} = require('../models/petModel')

// BANCO DE DADOS
// const pets = [
//   {nome: "henning", idade: 40, matricula: 123456}
// ]

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Lista todos os pets
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pets retornada com sucesso
 */

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Busca um pet pelo ID
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pet
 *     responses:
 *       200:
 *         description: Pet encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Rex
 *                 gender:
 *                   type: string
 *                   example: Macho
 *                 color:
 *                   type: string
 *                   example: Marrom
 *                 breed:
 *                   type: string
 *                   example: Labrador
 *       404:
 *         description: Pet não encontrado
 */

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Cria um novo pet
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rex
 *               gender:
 *                 type: string
 *                 example: Macho
 *               color:
 *                 type: string
 *                 example: Marrom
 *               breed:
 *                 type: string
 *                 example: Labrador
 *     responses:
 *       201:
 *         description: Pet criado com sucesso
 *       400:
 *         description: Erro nos dados enviados
 */
/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Atualiza um pet pelo ID
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pet a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Thor
 *               gender:
 *                 type: string
 *                 example: Macho
 *               color:
 *                 type: string
 *                 example: Preto
 *               breed:
 *                 type: string
 *                 example: Pitbull
 *     responses:
 *       200:
 *         description: Pet atualizado com sucesso
 *       400:
 *         description: Erro nos dados enviados
 *       404:
 *         description: Pet não encontrado
 */

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Remove um pet pelo ID
 *     tags: [Pets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pet a ser removido
 *     responses:
 *       200:
 *         description: Pet removido com sucesso
 *       404:
 *         description: Pet não encontrado
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

/* GET pets pelo ID API. */
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

/* GET pets de um tutor específico */
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

/* POST pets API. */
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

// DELETE pet API.
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

/* PUT pets API. */
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