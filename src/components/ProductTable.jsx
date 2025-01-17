import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const Container = styled.div`
  margin: 80px 20px 100px;
  text-align: center;
`;

const SearchInput = styled.input`
  width: 50%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th,
  td {
    text-align: left;
    padding: 10px;
    border: 1px solid #dee2e6;
  }

  th {
    background-color: #343a40;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;

  button {
    margin: 0 5px;
    padding: 5px 10px;
    font-size: 1rem;
    border: 1px solid #ced4da;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;

    &:hover {
      background-color: #007bff;
      color: white;
    }

    &[disabled] {
      background-color: #e9ecef;
      cursor: not-allowed;
    }
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  button {
    margin: 5px;
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:first-child {
      background-color: #dc3545;
      color: white;

      &:hover {
        background-color: #c82333;
      }
    }

    &:last-child {
      background-color: #6c757d;
      color: white;

      &:hover {
        background-color: #5a6268;
      }
    }
  }
`;

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(""); // 'edit' or 'delete'

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "insumos"));
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEdit = async (updatedProduct) => {
    const productRef = doc(db, "insumos", updatedProduct.id);
    await updateDoc(productRef, updatedProduct);
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    setSelectedProduct(null);
  };

  const handleDelete = async (id) => {
    const productRef = doc(db, "insumos", id);
    await deleteDoc(productRef);
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setSelectedProduct(null);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <Container>
      <h1>Gestión de Productos</h1>
      <SearchInput
        type="text"
        placeholder="Buscar por nombre o SKU"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer>
        <StyledTable>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>SKU</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.sku}</td>
                <td>${Math.round(product.price).toLocaleString("es-AR")}</td>
                <td>
                  <button onClick={() => {
                    setSelectedProduct(product);
                    setModalType("edit");
                  }}>Editar</button>
                  <button onClick={() => {
                    setSelectedProduct(product);
                    setModalType("delete");
                  }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableContainer>

      <Pagination>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            disabled={currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </Pagination>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {modalType === "delete" ? (
                <>
                  <h2>¿Seguro que deseas eliminar este producto?</h2>
                  <button onClick={() => handleDelete(selectedProduct.id)}>
                    Confirmar
                  </button>
                  <button onClick={() => setSelectedProduct(null)}>Cancelar</button>
                </>
              ) : (
                <>
                  <h2>Editar Producto</h2>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={selectedProduct.title}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="text"
                    placeholder="SKU"
                    value={selectedProduct.sku}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        sku: e.target.value,
                      }))
                    }
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={selectedProduct.price}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                  <button onClick={() => handleEdit(selectedProduct)}>
                    Guardar
                  </button>
                  <button onClick={() => setSelectedProduct(null)}>Cancelar</button>
                </>
              )}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
}

export default ProductTable;