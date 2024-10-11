const fs = require('fs/promises'); // Importar el modulo para manejar archivos de forma asyncrona
const path = require('path'); // Importar el modulo para manejar rutas de archivos
const { body, validationResult } = require('express-validator'); // Importar validaciones de express-validator

const filePath = path.join(__dirname, '../archivo.json'); // Ruta al archivo JSON donde se guardan los productos

// Funcion para cargar productos desde el archivo JSON
const loadProducts = async () => {
    const data = await fs.readFile(filePath, 'utf8'); // Leer el archivo JSON
    return JSON.parse(data).products; // Convertir el contenido a objeto y devolver la lista de productos
};

// Funcion para guardar productos en el archivo JSON
const saveProducts = async (products) => {
    // Guardar la lista de productos en formato JSON, con indentacion para mejorar la legibilidad
    await fs.writeFile(filePath, JSON.stringify({ products }, null, 2), 'utf8');
};

// Validacion de datos para agregar y actualizar productos
const validateProduct = [
    body('name').notEmpty().withMessage('El nombre es requerido.'), // Validar que el nombre no este vacio
    body('color').notEmpty().withMessage('El color es requerido.'), 
    body('marca').notEmpty().withMessage('La marca es requerida.'), 
    body('stock').notEmpty().withMessage('La cantidad es requerida.'), 
    body('price').notEmpty().withMessage('El precio es requerido.'), 
];

// Funcion para obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await loadProducts(); // Cargar productos desde el archivo
        const id = Number(req.params.id); // Obtener ID desde los parametros de la solicitud

        // Si hay un ID, buscar el producto especifico
        if (id) {
            const product = products.find(product => product.id === id); // Buscar el producto por ID

            // Si no se encuentra el producto, devolver error 404
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            return res.json(product); // Devolver el producto encontrado
        }

        // Si no hay ID, devolver todos los productos
        res.json(products); // Devolver la lista completa de productos
    } catch (error) {
        console.error(error); // Registrar el error en la consola
        res.status(500).json({ message: 'Error al obtener los productos', error: error.message }); // Devolver error 500
    }
};

// Funcion para agregar nuevos productos
const addProducts = [
    ...validateProduct,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, color, marca, stock, price } = req.body;
            const products = await loadProducts();

            // Validar que precio y cantidad sean números
            if (isNaN(stock) || isNaN(price)) {
                return res.status(400).json({ message: 'El precio y la cantidad deben ser números.' });
            }

            // Validar que los números sean positivos
            if (stock <= 0 || price <= 0) {
                return res.status(400).json({ message: 'El precio y la cantidad deben ser mayores que cero.' });
            }

            // Convertir el precio a formato string con el símbolo de '$'
            const formattedPrice = `$${parseFloat(price).toFixed(2)}`;

            const newProduct = {
                id: products.length ? products[products.length - 1].id + 1 : 1, // Asigna un nuevo ID
                name,
                color,
                marca,
                stock: parseInt(stock), // Convertir cantidad a número entero
                price: formattedPrice // Guardar el precio con el símbolo $
            };

            products.push(newProduct);
            await saveProducts(products);
            res.status(201).json({ message: 'Producto agregado', product: newProduct });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al agregar el producto', error: error.message });
        }
    }
];


// Funcion para eliminar productos
const delProducts = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID del producto a eliminar
        const products = await loadProducts(); // Cargar la lista de productos
        const productIndex = products.findIndex(product => product.id === parseInt(id)); // Buscar el indice del producto

        // Validar si el producto existe
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado' }); // Devolver error 404 si no se encuentra
        }

        // Eliminar el producto del array
        products.splice(productIndex, 1); // Eliminar el producto por indice

        // Guardar los productos actualizados
        await saveProducts(products); // Guardar la lista actualizada en el archivo

        res.status(200).json({ message: 'Producto eliminado exitosamente.' }); // Devolver respuesta exitosa
    } catch (error) {
        console.error('Error al eliminar el producto:', error); // Registrar el error en la consola
        res.status(500).json({ message: 'Error interno del servidor.' }); // Devolver error 500
    }
};

// Funcion para actualizar productos
const putProducts = [
    ...validateProduct, // Incluir validaciones definidas anteriormente
    async (req, res) => {
        const errors = validationResult(req); // Verificar si hay errores de validacion
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Devolver errores de validacion si existen
        }

        try {
            const id = Number(req.params.id); // Obtener el ID del producto a actualizar
            const { name, color, marca, stock, price } = req.body; // Obtener los datos del producto actualizado
            let products = await loadProducts(); // Cargar la lista actual de productos

            const productIndex = products.findIndex(product => product.id === id); // Buscar el indice del producto

            // Validar si el producto existe
            if (productIndex === -1) {
                return res.status(404).json({ message: 'Producto no encontrado' }); // Devolver error 404 si no se encuentra
            }

            // Validar que precio y cantidad sean numeros
            if (isNaN(stock) || isNaN(price)) {
                return res.status(400).json({ message: 'El precio y la cantidad deben ser numeros.' });
            }

            // Validar que los numeros sean positivos
            if (stock <= 0 || price <= 0) {
                return res.status(400).json({ message: 'El precio y la cantidad deben ser mayores que cero.' });
            }

            // Actualizar producto con los nuevos datos
            products[productIndex] = { id, name, color, marca, stock, price }; 
            await saveProducts(products); // Guardar la lista actualizada en el archivo

            res.json({ message: 'Producto actualizado', product: products[productIndex] }); // Devolver respuesta exitosa
        } catch (error) {
            console.error(error); // Registrar el error en la consola
            res.status(500).json({ message: 'Error al actualizar el producto', error: error.message }); // Devolver error 500
        }
    }
];

// Exportar las funciones para ser utilizadas en otros modulos
module.exports = {
    getAllProducts,
    addProducts,
    delProducts,
    putProducts
};
