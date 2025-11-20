# sis257_Veterinaria
## Software de administracion de una Veterinaria

### Integrantes
* Alfaro Ayzama Jose Fernando
* Maydana Chavez Harold Limberth
* Escobar Zarate Julio Cesar

---

## Descripcion del Negocio

El software para la veterinaria busca **automatizar la gestion de los procesos diarios**, permitiendo una administracion mas eficiente y organizada. Con esta herramienta se podra llevar un **control claro de la informacion**, registrar ventas de manera agil, y servicios sin complicaciones y reducir errores comunes del manejo manual.

La automatizacion ayudara a **optimizar el tiempo**, mejorar la atencion a los clientes, mantener un registro preciso de las operaciones y garantizar un control adecuado de los productos y servicios. En general, permitira que la veterinaria funcione de manera mas ordenada, profesional y orientada a brindar un mejor servicio.

### Entidades Tentativas

A continuacion, se presenta el modelo de datos inicial del sistema:

* **Cliente** (id_cliente, nombres, apellidos, telefono, direccion)
* **Mascotas** (id_mascota, nombre, especie, raza, edad)
* **Ventas** (id_venta, id_cliente, fecha, total)
* **Detalle-ventas** (id_detalle_venta, id_venta, id_cliente, id_servicio, tipo_item, cantidad, precio_unitario, subtotal)
* **Productos** (id_producto, nombre, categoria, descripcion, precio, stock)
* **Servicios** (id_servicio, nombre, descripcion, tipo_servicio, precio)

## Diagrama

Puedes acceder al diagrama del proyecto a traves del siguiente enlace:
[Diagrama Entidad-Relacion/UML] (https://drive.google.com/file/d/1oGQ3gspCaNSbaa9IjAtvv2WXifv3I3Pl/view?usp=sharing)

---

## Documentacion del Proyecto Local

Este repositorio contiene el codigo fuente para el proyecto, compuesto por un **Frontend (Vue.js)** y un **Backend (NestJS/Node.js)**.

Sigue estos pasos para levantar el entorno de desarrollo local.

### Prerrequisitos

Asegurate de tener instalado lo siguiente antes de comenzar:

* **Node.js** (Se recomienda la version LTS)
* **npm** (Viene con Node.js)
* **PostgreSQL** (Servidor de Base de Datos)
* **DBeaver, pgAdmin o cualquier cliente SQL** (Para la administracion de la BD)

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

.env
# Configuracion del Servidor
PORT=3000
NODE_ENV=development

# Configuracion de la Base de Datos (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=bd_veterinaria
DB_PASSWORD=123456
DB_DATABASE=bd_veterinaria


### 2.2. Instalacion y Ejecucion

1.  Navega a la carpeta del backend en tu terminal:
    ```bash
    cd [nombre_de_carpeta_backend]
    ```
2.  **Instala Node.js (si no esta instalado).**
3.  Instala las dependencias:
    ```bash
    npm install
    ```
4.  Levanta el servidor en modo desarrollo:
    ```bash
    npm run start:dev
    ```
    El backend estara corriendo en `http://localhost:3000` (o el puerto que configuraste).

---

## 3. Frontend (Vue.js)

El frontend es la interfaz de usuario de la aplicacion.

### 3.1. Instalacion y Ejecucion

1.  Abre una terminal nueva y navega a la carpeta del frontend:
    ```bash
    cd [nombre_de_carpeta_frontend]
    ```
2.  **Instala Node.js (si no esta instalado).**
3.  Instala las dependencias:
    ```bash
    npm install
    ```
4.  Levanta la aplicacion en modo desarrollo:
    ```bash
    npm run dev
    ```
    La aplicacion web estara disponible en la URL que indique la consola (tipicamente `http://localhost:5173`).

---

## Uso Rapido

| Componente | Carpeta | Comando para Levantar | URL Tipica |
| :--- | :--- | :--- | :--- |
| **Backend** | /backend | `npm run start:dev` | `http://localhost:3000` |
| **Frontend** | /frontend | `npm run dev` | `http://localhost:5173` |
