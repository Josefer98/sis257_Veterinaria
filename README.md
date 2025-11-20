### sis257_Veterinaria
## Software de administracion de una Veterinaria

### Integrantes
Alfaro Ayzama José Fernando

Maydana Chavez Harold Limberth

Escobar Zarate Julio Cesar

## Descripcion del Negocio
El software para la veterinaria busca automatizar la gestión de los procesos diarios, permitiendo una administración más eficiente y organizada. Con esta herramienta se podrá llevar un control claro de la información, registrar ventas de manera ágil,  y servicios sin complicaciones y reducir errores comunes del manejo manual.

La automatización ayudará a optimizar el tiempo, mejorar la atención a los clientes, mantener un registro preciso de las operaciones y garantizar un control adecuado de los productos y servicios. En general, permitirá que la veterinaria funcione de manera más ordenada, profesional y orientada a brindar un mejor servicio.

### Entidades tentativas
Cliente(id_cliente,nombres,apellidos,telefono,direccion)

Mascotas(id_macota,nombre,especie,raza,edad)

Ventas(id_venta,id_cliente,fecha,total)

Detalle-ventas(id_detalle-venta,id_venta,id_cliente,id_servicio,tipo_item,cantidad, precio_unitario, subtotal)

Productos(id_producto,nombre,categoria,descripcion,precio,stock)

Servicios(id_servicio,nombre,descripcion,tipo_servicio,precio)

## Diagrama
https://drive.google.com/file/d/1oGQ3gspCaNSbaa9IjAtvv2WXifv3I3Pl/view?usp=sharing


##### Documentacion del Proyecto Local #####

Este repositorio contiene el codigo fuente para el proyecto, compuesto por un **Frontend (Vue.js)** y un **Backend (NestJS/Node.js)**.

Sigue estos pasos para levantar el entorno de desarrollo local.

## Prerrequisitos

Asegurate de tener instalado lo siguiente antes de comenzar:

* Node.js (Se recomienda la version LTS)
* npm (Viene con Node.js)
* PostgreSQL (Servidor de Base de Datos)
* DBeaver, pgAdmin o cualquier cliente SQL (Para la administracion de la BD)

## 1. Configuracion de la Base de Datos (PostgreSQL)

El proyecto requiere una base de datos PostgreSQL activa. **La base de datos principal es bd_veterinaria.**

### 1.1. Conexion y Creacion en DBeaver

1.  Asegurate de que tu servidor de **PostgreSQL** este corriendo.
2.  Utiliza **DBeaver** (o tu cliente preferido) para conectarte como superusuario (`postgres`).
3.  **Crea el usuario de la aplicacion** y la base de datos usando los siguientes comandos (si aun no existen):

    * **Creacion del Usuario:**
        ```sql
        CREATE USER bd_veterinaria WITH PASSWORD '123456'; 
        ```
    * **Creacion de la Base de Datos:**
        ```sql
        CREATE DATABASE bd_veterinaria OWNER bd_veterinaria;
        ```
4.  Crea una Nueva Conexion en DBeaver especificamente para `bd_veterinaria`, usando el usuario `bd_veterinaria` y su contrasena.

## 2. Backend (NestJS/Node.js)

El backend es responsable de la logica de negocio y la comunicacion con la base de datos.

### 2.1. Variables de Entorno

Crea un archivo llamado `.env` en la raiz de la carpeta del backend y configura las variables de conexion. **Usa esta configuracion exacta:**

```env
# Configuracion del Servidor
PORT=3000
NODE_ENV=development

# Configuracion de la Base de Datos (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=bd_veterinaria
DB_PASSWORD=123456
DB_DATABASE=bd_veterinaria
