const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3005;


// Rutas desde /routes
const productsRoute = require('./routes/productRoute'); // Rutas de productos

// Middleware para parsear JSON en las solicitudes
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Middleware para habilitar CORS
app.use(cors());

// Ruta para leer el archivo JSON
app.get('/registro', (req, res) => {
    const filePath = path.join(__dirname, '../archivo.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error al leer el archivo JSON');
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para la root "/"
app.get('/', (req, res) => {
    res.send('Bienvenido a la API. /api/products');
});

// Definir las rutas de productos
app.use('/api/products', productsRoute);
// init el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


//http://192.168.1.81:3005/api/products

//const delProducts = async (req, res) => {
  //  try {
    //    const id = Number(req.params.id); // Obtener el ID desde los parámetros de la URL
      //  let products = await loadProducts();

        // Verifica que el ID sea válido
        //if (isNaN(id)) {
          //  return res.status(400).json({ message: 'El ID debe ser un número.' });
        //}

       // const initialLength = products.length;
      //  products = products.filter(product => product.id !== id);

     //   if (products.length === initialLength) {
       //     return res.status(404).json({ message: 'Producto no encontrado.' });
      //  }

      //  await saveProducts(products);
       // res.json({ message: 'Producto eliminado' });
  //  } catch (error) {
     //  console.error(error);
    //    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
    //}
//};