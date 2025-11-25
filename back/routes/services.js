// Arquivo: back/routes/services.js

var express = require('express');
var router = express.Router();
var authenticateToken = require('../middleware/auth')
// CORREÇÃO: Usando createService (da correção anterior)
var {findServiceById, createService, getServices, deleteService, updateService} = require('../models/serviceModel') 

/* GET services API. (Sem autenticação)*/
router.get('/', function(req, res, next) { 
  getServices((err, services)=>{
    if(err){
      console.error('getServices erro:', err.message)
      return res.status(500).json({error: 'Erro ao buscar serviços'})
    }
    return res.status(200).json({services: services})
  })
});

/* GET services pelo ID API. */
router.get('/:id', authenticateToken, function(req, res, next) {
// ...
});

/* POST services API. */
// MUDANÇA TEMPORÁRIA: Removido authenticateToken para permitir o POST sem login
router.post('/', function(req, res, next) { 
  const serviceData = req.body;

  console.log('Tentando criar serviço:', serviceData)

  createService(serviceData, (err, newService)=>{
    if(err){
      console.error('createService erro:', err.message)
      return res.status(500).json({error: 'Erro ao salvar serviço'})
    }

    return res.status(201).json({message: 'Serviço criado com sucesso', pet: newService})
  })
});

// DELETE service API.
router.delete('/:id', authenticateToken, function(req, res){
// ...
})

/* PUT services API. */
router.put('/:id', authenticateToken, function(req, res){
// ...
})

module.exports = router;