var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth')
var {findPetById, createPet, getPets, deletePet, updatePet} = require('../models/petModel')

/* GET pets API. */
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