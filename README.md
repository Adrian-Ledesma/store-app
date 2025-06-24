# 🛒 StoreApp – Gestión de Productos con React + Flask + MongoDB

Este proyecto es una aplicación web full stack que permite gestionar productos con campos como título, categoría, descripción, precio e imagen. Combina **React** en el frontend, **Flask** en el backend y **MongoDB** como base de datos.

## 🚀 Características

- 🧾 Registro, edición y eliminación de productos.
- 🗂️ Visualización de lista de productos en tabla.
- 🖼️ Carga de imágenes al servidor local (carpeta `/uploads`).
- 📦 Almacenamiento de la ruta de la imagen en la base de datos.
- 💬 Notificaciones visuales y confirmaciones con SweetAlert2.
- 🔗 Consumo de API RESTful para operaciones CRUD.

## 🛠️ Tecnologías utilizadas

- **Frontend:** React, Bootstrap, SweetAlert2
- **Backend:** Flask, Flask-PyMongo, Flask-CORS
- **Base de Datos:** MongoDB
- **Otros:** FormData, Fetch API

## Configura el backen

cd backend
pip install -r requirements.txt
python app.py

## Configura el frontend

cd frontend
npm install
npm start

## Accede a la app
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
  
✅ Requisitos cumplidos
- Cambiar input de imagen por campo tipo File ✅
- Guardar imagen en servidor local ✅
- Guardar solo ruta en MongoDB ✅
- Mostrar imagen correctamente en frontend ✅
- Reemplazar alert y confirm por SweetAlert2 ✅
- Subir proyecto a GitHub ✅
  
🧠 Autor
Desarrollado por Adrián Ledesma como parte de la práctica de desarrollo web con Flask y React.




