from flask import Flask, request, jsonify, make_response, send_from_directory
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS
import os #RMODIFICAMOS IMPORTS NECESARIOS PARA MANEJAR ARCHIVOS
from werkzeug.utils import secure_filename #MODIFICAMOS IMPORTS NECESARIOS PARA MANEJAR ARCHIVOS

app = Flask(__name__)  # Crea un objeto de aplicación Flask

# URI de la base de datos de MongoDB
app.config["MONGO_URI"] = "mongodb://localhost/storedb"
mongo = PyMongo(app)  # Conexión a la base de datos
db = mongo.db.products  # Colección que se creará

CORS(app)

# AGREGAMOS RUTA DONDE SE GUARDARÁN LAS IMÁGENES
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=["GET"])
def index():
    return "<h1>Hello World!</h1>"

# MODIFICAMOS LA INSERCIÓN DE UN PRODUCTO CON IMAGEN COMO ARCHIVO
@app.route('/products', methods=["POST"])
def createProduct():
    image = request.files["image"]
    filename = secure_filename(image.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    image.save(filepath)

    product = db.insert_one({
        "title": request.form["title"],
        "price": request.form["price"],
        "category": request.form["category"],
        "description": request.form["description"],
        "image": f"/uploads/{filename}"
    })

    response = make_response(
        jsonify({
            "id": str(product.inserted_id)
        }),
        201
    )
    response.headers["Content-type"] = "application/json"
    return response

# Consulta de todos los productos
@app.route("/products", methods=["GET"])
def getProducts():
    products = []  # lista para almacenar los registros de la BD
    for product in db.find():  # por cada producto de la BD...
        products.append({
            "_id": str(ObjectId(product["_id"])),
            "title": product["title"],
            "price": product["price"],
            "category": product["category"],
            "description": product["description"],
            "image": product["image"]
        })
    return jsonify(products)

# Consulta de un producto específico
@app.route("/product/<id>", methods=["GET"])
def getProduct(id):
    product = db.find_one({"_id": ObjectId(id)})
    return jsonify({
        "_id": str(ObjectId(product["_id"])),
        "title": product["title"],
        "price": product["price"],
        "category": product["category"],
        "description": product["description"],
        "image": product["image"]
    })

# Eliminar un producto
@app.route("/product/<id>", methods=["DELETE"])
def deleteProduct(id):
    product = db.delete_one({"_id": ObjectId(id)})
    response = make_response(
        jsonify({
            "num_rows": str(product.deleted_count)
        }),
        200
    )
    response.headers["Content-type"] = "application/json"
    return response

# Actualización de un producto (excepto el _id)
@app.route("/product/<id>", methods=["PUT"])
def updateProduct(id):
    print(f"Update request received for ID: {id}")

    # MODIFICAMOS PARA QUE RECIBA DATOS COMO FORM EN VEZ DE JSON, Y PERMITE IMAGEN OPCIONAL
    data = request.form
    updated_data = {
        "title": data["title"],
        "price": data["price"],
        "category": data["category"],
        "description": data["description"]
    }

    if "image" in request.files:
        image = request.files["image"]
        if image.filename != "":
            filename = secure_filename(image.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            image.save(filepath)
            updated_data["image"] = f"/uploads/{filename}"

    result = db.update_one(
        {"_id": ObjectId(id)},
        {"$set": updated_data}
    )

    if result.modified_count == 1:
        return jsonify({"message": "Producto actualizado exitosamente"}), 200
    else:
        return jsonify({"message": "No se encontró el producto o no hubo cambios"}), 404

# Consulta de categorías
@app.route("/categories", methods=["GET"])
def getCategories():
    categories = []
    for category in mongo.db.categories.find():
        categories.append({
            "_id": str(category["_id"]),
            "name": category["name"]
        })
    return jsonify(categories)

# AGREGAMOS ENDPOINT PARA SERVIR LAS IMÁGENES GUARDADAS
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True)