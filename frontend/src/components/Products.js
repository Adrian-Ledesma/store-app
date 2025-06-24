import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'; //  importación de SweetAlert2

export const Products = () => {
  const URI_API = "http://localhost:5000";

  const [_id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const getCategories = async () => {
    const response = await fetch(`${URI_API}/categories`);
    const data = await response.json();
    setCategories(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveProduct();
  };

  // FormData para enviar imagen
  const saveProduct = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("image", image);

    const endpoint = editing
      ? `${URI_API}/product/${_id}`
      : `${URI_API}/products`;

    const method = editing ? "PUT" : "POST";

    await fetch(endpoint, {
      method,
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        //  reemplazo de alert() por SweetAlert2
        Swal.fire({
          icon: 'success',
          title: `Producto ${editing ? 'editado' : 'guardado'}`,
          text: `ID: ${data.id}`
        });
        getProducts();
        resetForm();
        setEditing(false);
      });
  };

  const getProducts = async () => {
    await fetch(`${URI_API}/products`)
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  const getProduct = async (id) => {
    await fetch(`${URI_API}/product/${id}`)
      .then(res => res.json())
      .then(data => {
        setId(data._id);
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setImage(data.image);
        setPrice(data.price);
        setEditing(true);
      });
  };

  // SweetAlert2 para confirmar eliminación
  const deleteProduct = async (id) => {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `Estás por eliminar el producto ${id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`${URI_API}/product/${id}`, {
          method: 'DELETE',
          headers: { "Content-Type": "application/json" }
        })
          .then(res => res.json())
          .then(data => {
            if (data.num_rows === "1") {
              getProducts();
              Swal.fire({
                icon: 'success',
                title: 'Producto eliminado',
                text: `ID: ${id}`
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el producto'
              });
            }
          });
      }
    });
  };

  const resetForm = () => {
    setId('');
    setTitle('');
    setCategory('');
    setDescription('');
    setImage('');
    setPrice('');
  };

  return (
    <div className="row">
      {/* Formulario para guardar productos */}
      <div className="col-md-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <input type="text" onChange={e => setTitle(e.target.value)} value={title}
              className="form-control" placeholder="Title" required />
          </div>

          <div className="form-group">
            <select onChange={e => setCategory(e.target.value)} value={category}
              className="form-control" required>
              <option value="">Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input type="text" onChange={e => setDescription(e.target.value)} value={description}
              className="form-control" placeholder="Description" required />
          </div>

          {/* input tipo archivo */}
          <div className="form-group">
            <input type="file" accept="image/*"
              className="form-control"
              onChange={e => setImage(e.target.files[0])}
              required />
          </div>

          <div className="form-group">
            <input type="number" onChange={e => setPrice(e.target.value)} value={price}
              className="form-control" placeholder="Price" required />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            {editing ? "Edit" : "Save"}
          </button>
        </form>
      </div>

      {/* Tabla para mostrar los productos */}
      <div className="col-md-8">
        <table className="table table-hover table-striped">
          <thead>
            <tr className="table-primary">
              <th>Id</th>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th style={{ maxWidth: "30px" }}>Image</th>
              <th>Price</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id || product._id}>
                <td>{product.id || product._id}</td>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
                {/* se usa ruta completa del backend */}
                <td><img src={`http://localhost:5000${product.image}`} height={100} alt={product.title} /></td>
                <td>{product.price}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => getProduct(product.id || product._id)}>
                    Edit
                  </button>{" "}
                  <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(product.id || product._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};