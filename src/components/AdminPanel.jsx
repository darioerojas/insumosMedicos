import React, { useState } from "react";
import styled from "styled-components";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import MoonLoader from "react-spinners/MoonLoader";

const AdminContainer = styled(motion.div)`
  margin: 80px 20px 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const FormContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 100%;
  max-width: 500px;

  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.8rem;
    color: #343a40;
  }

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
    color: #495057;

    input,
    textarea {
      width: 100%;
      margin-top: 5px;
      padding: 10px;
      border: 1px solid #ced4da;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.3s;

      &:focus {
        border-color: #80bdff;
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
      }
    }

    textarea {
      resize: vertical;
    }
  }

  button {
    display: block;
    width: 100%;
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

function AdminPanel() {
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [fichaTecnica, setFichaTecnica] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [spinner, setSpinner] = useState(false);

  const handleUpload = async () => {
    if (!title || !sku || !description || !fichaTecnica || !image || !price) {
      alert("Por favor, completa todos los campos antes de continuar.");
      return;
    }

    try {
      setSpinner(true);
      // Cálculo del precio con un 80% adicional
      const finalPrice = parseFloat(price) * 1.8;

      // Subir imagen a Firebase Storage
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Guardar datos en Firestore
      await addDoc(collection(db, "insumos"), {
        title,
        sku,
        description,
        fichaTecnica,
        price: finalPrice.toFixed(2), // Guardar con dos decimales
        imageUrl,
      });

      // Limpiar los campos
      setTitle("");
      setSku("");
      setDescription("");
      setFichaTecnica("");
      setPrice("");
      setImage(null);

      alert("Producto agregado correctamente");
      setSpinner(false);
    } catch (error) {
      console.error("Error al subir los datos:", error);
      alert("Hubo un problema al agregar el producto.");
    }
  };

  return (
    <AdminContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FormContainer>
        <h2>Ingresar Producto</h2>
        <label>
          Nombre del producto:
          <input
            type="text"
            placeholder="Ej: Guantes de látex"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Código SKU:
          <input
            type="text"
            placeholder="Ej: SKU12345"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </label>
        <label>
          Descripción:
          <textarea
            placeholder="Ej: Guantes de látex resistentes y cómodos."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Ficha técnica (enlace o descripción):
          <textarea
            placeholder="Ej: Características técnicas del producto."
            value={fichaTecnica}
            onChange={(e) => setFichaTecnica(e.target.value)}
            required
          />
        </label>
        <label>
          Precio:
          <input
            type="number"
            placeholder="Ej: 100"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Imagen del producto:
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </label>
        <div style={{display: "flex", justifyContent: "center",}}>
        {spinner ? (
          <MoonLoader size={40} color={"#0056b3"} speedMultiplier={0.8}/>
        ) : (
          <motion.button
            onClick={handleUpload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Agregar Insumo
          </motion.button>
        )}
        </div>
      </FormContainer>
    </AdminContainer>
  );
}

export default AdminPanel;
