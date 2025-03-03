# Proyecto Backend con Handlebars y WebSocket

Este proyecto está configurado para trabajar con **Handlebars** como motor de plantillas y **Socket.io** para la comunicación en tiempo real. A través de WebSockets, se actualiza automáticamente la lista de productos en la vista `realTimeProducts.handlebars` cada vez que se agrega o elimina un producto.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución de JavaScript
- **Express.js**: Framework web para Node.js
- **Handlebars**: Motor de plantillas para renderizar vistas
- **Socket.io**: Librería para comunicación en tiempo real
- **MongoDB**: Base de datos para almacenar los productos

### Configuración del servidor

1. El servidor está configurado para usar Handlebars como motor de plantillas. La vista principal `home.handlebars` muestra la lista de productos almacenados en la base de datos.
   
2. WebSockets se implementa con **Socket.io** para actualizar en tiempo real la vista `realTimeProducts.handlebars` cada vez que se agrega o elimina un producto.

## Rutas

- `/`: Página principal con la lista de productos (renderizada con Handlebars).
- `/realtimeproducts`: Vista en tiempo real que se actualiza automáticamente cuando se agregan o eliminan productos.

## Funcionamiento de WebSockets

- Cada vez que se cree o elimine un producto, el servidor enviará un mensaje a los clientes conectados a través de WebSocket para actualizar la lista de productos en la vista `realTimeProducts.handlebars`.
  
## Ejemplo de uso

1. Al acceder a la ruta `/`, los usuarios pueden ver la lista de productos actuales.
2. Al acceder a `/realtimeproducts`, la vista mostrará la misma lista de productos, pero cualquier cambio en la base de datos (creación o eliminación de productos) se reflejará automáticamente sin necesidad de recargar la página.
