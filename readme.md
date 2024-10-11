# Proyecto de API de Productos

Este proyecto es una API sencilla para manejar productos. Permite agregar, obtener, actualizar y eliminar productos almacenados en un archivo JSON.

## Tecnologias Usadas

- Node.js
- Express
- express-validator
- fs/promises

## Estructura del Proyecto

- `controllers/`: Contiene la logica para manejar los productos.
- `routes/`: Define las rutas para acceder a la API.
- `archivo.json`: Archivo donde se guardan los productos.

## Como Iniciar

1. Clonar el repositorio.
2. Navegar al directorio del proyecto.
3. Instalar las dependencias:
   ```bash
   npm install
4. //iniciar el servidor 
npm start


Acceder a la API en http://localhost:3005/api/products.
Rutas Disponibles
GET /api/products: Obtener todos los productos.
GET /api/products/:id: Obtener un producto por ID.
POST /api/products: Agregar un nuevo producto.
PUT /api/products/:id: Actualizar un producto por ID.
DELETE /api/products/:id: Eliminar un producto por ID.
Ejemplo de Uso
Para agregar un producto, se puede hacer una solicitud POST con el siguiente cuerpo:

json
Copiar código
{
    "name": "Nombre del Producto",
    "color": "Color del Producto",
    "marca": "Marca del Producto",
    "stock": 10,
    "price": 19.99
}
Notas
Asegurarse de que el archivo archivo.json tenga la estructura adecuada al iniciar la API.
El precio y el stock deben ser numeros positivos.
Contribuciones
Las contribuciones son bienvenidas. Por favor, abrir un issue o enviar un pull request.

Licencia
Este proyecto no tiene licencia especifica. Usar a su discrecion.