import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const PageContainer = styled.div`
  margin: 80px 20px 100px; /* Márgenes para el navbar y footer */
  text-align: center;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 60%;
    object-fit: cover;
  }

  .content {
    padding: 10px;

    h2 {
      font-size: 1rem;
      margin-bottom: 8px;
      color: #343a40;
    }

    p {
      font-size: 0.9rem;
      color: #6c757d;
    }

    button {
      margin-top: 10px;
      padding: 8px 10px;
      font-size: 0.8rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;

      &.add-to-cart {
        background-color: #007bff;
        color: white;

        &:hover {
          background-color: #0056b3;
        }
      }

      &.view-more {
        margin-left: 10px;
        background-color: #6c757d;
        color: white;

        &:hover {
          background-color: #5a6268;
        }
      }
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
  z-index: 9999; /* Asegúrate de que esté sobre el nav y footer */
  overflow: auto; /* Permite hacer scroll si la imagen excede la pantalla */
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .tabs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    button {
      flex: 1;
      padding: 10px;
      font-size: 0.9rem;
      border: none;
      cursor: pointer;
      background-color: #f1f1f1;
      transition: background-color 0.2s;

      &.active {
        background-color: #007bff;
        color: white;
      }
    }
  }

  .tab-content {
    max-height: 200px;
    overflow-y: auto;
    font-size: 0.9rem;
    color: #6c757d;
  }

  .close-button {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.5rem;
    color: #6c757d;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      color: #343a40;
    }
  }
`;

const TopModal = styled(motion.div)`
  width: 250px;
  position: fixed;
  top: 10px;
  left: 20%;
  transform: translateX(-50%);
  background: #28a745;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
`;

function InsumoList({
  cart = [],
  setCart,
  removeFromCart,
  sendCartToWhatsApp,
}) {
  const [insumos, setInsumos] = useState([]);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(null); // Controla la imagen ampliada
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "insumos"),
      (querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInsumos(items);
      }
    );

    // Cleanup: Cancelar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const addToCart = (product) => {
    if (!cart.some((item) => item.id === product.id)) {
      setCart([...cart, { ...product, quantity: 1 }]); // Cantidad predeterminada de 1
      setShowAddedModal(true);
      setTimeout(() => setShowAddedModal(false), 4000);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Filtrar productos según el término de búsqueda
  const filteredInsumos = insumos.filter(
    (insumo) =>
      insumo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insumo.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <h1>Nuestros Productos</h1>

      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o SKU"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "50%",
          padding: "10px",
          margin: "10px auto",
          border: "1px solid #ccc",
          borderRadius: "5px",
          fontSize: "1rem",
        }}
      />

      {/* Modal para agregar al carrito */}
      <AnimatePresence>
        {showAddedModal && (
          <TopModal
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            Producto agregado al carrito
          </TopModal>
        )}
      </AnimatePresence>

      {/* Modal para imagen ampliada */}
      <AnimatePresence>
        {showFullImage && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullImage(null)}
          >
            <motion.img
              src={showFullImage}
              alt="Imagen ampliada"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain" /* Asegura que la imagen no se deforme */,
                borderRadius: "8px",
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </ModalOverlay>
        )}
      </AnimatePresence>

      <GridContainer>
        {filteredInsumos.map((insumo) => (
          <Card
            key={insumo.id}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Imagen del producto */}
            <img
              src={insumo.imageUrl}
              alt={insumo.title}
              onClick={() => setShowFullImage(insumo.imageUrl)} // Ampliar imagen
              style={{ cursor: "pointer" }}
            />

            <div className="content">
              <h2>{insumo.title}</h2>
              <p>SKU: {insumo.sku}</p>
              <p>Precio: {formatPrice(insumo.price)}</p>
              <button className="add-to-cart" onClick={() => addToCart(insumo)}>
                Agregar al carrito
              </button>
              <button
                className="view-more"
                onClick={() => setSelectedInsumo(insumo)}
              >
                Ver más
              </button>
            </div>
          </Card>
        ))}
      </GridContainer>

      {/* Modal para detalles del producto */}
      <AnimatePresence>
        {selectedInsumo && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInsumo(null)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{selectedInsumo.title}</h2>
              <div className="tabs">
                <button
                  className={activeTab === "description" ? "active" : ""}
                  onClick={() => setActiveTab("description")}
                >
                  Descripción
                </button>
                <button
                  className={activeTab === "technical" ? "active" : ""}
                  onClick={() => setActiveTab("technical")}
                >
                  Ficha Técnica
                </button>
              </div>
              <div className="tab-content">
                {activeTab === "description" && (
                  <p>{selectedInsumo.description}</p>
                )}
                {activeTab === "technical" && (
                  <p>{selectedInsumo.fichaTecnica}</p>
                )}
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}

export default InsumoList;
