const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');

router.get('/',productController.getAllProducts );
router.get('/:id',productController.getAllProducts );
router.post('/',productController.addProducts );

// Eliminar un producto por ID
router.delete('/:id', productController.delProducts); // Cambia para recibir ID en la URL

// Actualizar un producto por ID
router.put('/:id', productController.putProducts); // Cambia para recibir ID en la URL


module.exports = router;