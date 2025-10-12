# sis257_Veterinaria
## Software de administracion de una Veterinaria
### Integrantes
Alfaro Ayzama José Fernando

Maydana Chavez Harold Limberth

Escobar Zarate Julio Cesar

## Descripcion del Negocio
El software para la veterinaria busca automatizar la gestión de los procesos diarios, permitiendo una administración más eficiente y organizada. Con esta herramienta se podrá llevar un control claro de la información, registrar ventas de manera ágil, gestionar inventarios y servicios sin complicaciones y reducir errores comunes del manejo manual.

La automatización ayudará a optimizar el tiempo, mejorar la atención a los clientes, mantener un registro preciso de las operaciones y garantizar un control adecuado de los productos y servicios. En general, permitirá que la veterinaria funcione de manera más ordenada, profesional y orientada a brindar un mejor servicio.
### Entidades tentativas
Cliente(id_cliente,nombres,apellidos,telefono,nombre_mascota,tipo_mascota,raza,edad_mascota)
Ventas(id_venta,id_cliente,fecha,total)
FacturaProductos(id_producto,id_venta,id_producto,cantidad,total_pago)
Productos(id_producto,nombre,categoria,descripcion,precio,stock)
FacturaServicios(id_factura,id_venta,id_servicio,cantidad,total_pago)
Servicios(id_servicio,nombre,descripcion,tipo_servicio,precio)

## Diagrama
https://drive.google.com/file/d/1oGQ3gspCaNSbaa9IjAtvv2WXifv3I3Pl/view?usp=sharing

