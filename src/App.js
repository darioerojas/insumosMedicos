import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import InsumoList from "./components/InsumoList";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ProductTable from "./components/ProductTable";

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const sendCartToWhatsApp = () => {
    const phoneNumber = "+542616862323"; // Número al que se enviará el mensaje
    const message = cart
      .map(
        (item) =>
          `- ${item.title} (SKU: ${item.sku}) x${item.quantity} - Total: $${(
            item.price * item.quantity
          ).toLocaleString("es-AR")}`
      )
      .join("\n");
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      `Lista de productos:\n${message}`
    )}`;
    window.open(url, "_blank");
  };

  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Evita cantidades menores a 1
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Limpiar suscripción al desmontar
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <Router>
      <NavBar
        user={user}
        onLogout={handleLogout}
        cart={cart}
        removeFromCart={removeFromCart}
        sendCartToWhatsApp={sendCartToWhatsApp}
        updateCartQuantity={updateCartQuantity}
      />
      <main>
        <Routes>
          <Route
            path="/"
            element={<InsumoList cart={cart} setCart={setCart} />}
          />
          <Route
            path="/admin"
            element={user ? <AdminPanel /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/productList"
            element={user ? <ProductTable /> : <></>}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
