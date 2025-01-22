import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Navbar, Nav, Button } from "react-bootstrap";

// Animación para el carrito desplegable
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const CartDropdown = styled.div`
  position: absolute;
  top: 56px; /* Altura del navbar */
  right: 0;
  width: 100%;
  max-height: 50vh;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  z-index: 1050;
  padding: 1rem;
  overflow: auto;

  animation: ${(props) => (props.$isOpen ? fadeIn : fadeOut)} 0.3s ease-in-out;
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  transition: visibility 0.3s, opacity 0.3s;

  h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #343a40;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      width: 100%;
      font-size: small;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: row;
      gap: 8px;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid #bcbec0;
      span {
        width: 40%;
      }
      .divContent {
        width: 80px;
        text-align: center;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
        gap: 3px;
        font-weight: bold;
        button {
          width: 20%;
          font-size: large;
          padding: 0px;
          font-weight: bold;
        }
      }
      strong {
        width: 110px;
        text-align: center;
      }

      button {
        width: 80px;
        margin: 0px;
        background: none;
        border: none;
        color: #dc3545;
        cursor: pointer;

        &:hover {
          text-decoration: none;
          color: white;
        }
      }
    }
  }

  button {
    margin-top: 1rem;
    width: 100%;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem;
    position: sticky;
    bottom: 0;

    &:hover {
      background: #218838;
    }
  }
`;

const StyledNavbar = styled(Navbar)`
  padding: 5px 15px 5px 15px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1030;
  background-color: #343a40;
  .contenedorNav {
    a {
      margin-right: auto;
    }
    margin: 0px;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
  }
  .navbar-brand {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    &:hover {
      color: #adb5bd;
    }
  }

  .nav-link {
    color: white;
    &:hover {
      color: #adb5bd;
    }
  }

  .btn-cart {
    position: relative;

    &::after {
      content: "${(props) => props.$cartCount || 0}";
      position: absolute;
      top: -5px;
      right: -10px;
      background: #dc3545;
      color: white;
      font-size: 0.75rem;
      padding: 0.2rem 0.4rem;
      border-radius: 50%;
      font-weight: bold;
    }
  }
`;

const StyledNav = styled(Nav)`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin: 0px;
`;

function NavBar({
  cart = [],
  removeFromCart,
  sendCartToWhatsApp,
  user,
  onLogout,
  updateCartQuantity,
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  return (
    <StyledNavbar expand="lg" variant="dark" $cartCount={cart.length}>
      <div className="contenedorNav">
        <Navbar.Brand as={Link} to="/">
          Inicio
        </Navbar.Brand>
        <StyledNav>
          {user ? (
            <>
              <Nav.Link as={Link} to="/Admin">
                Admin
              </Nav.Link>
              <Nav.Link as={Link} to="/ProductList">
                List.
              </Nav.Link>
              <Nav.Link onClick={handleLogoutClick}>Salir</Nav.Link>
            </>
          ) : (
            <Nav.Link as={Link} to="/login">
              Ingresar
            </Nav.Link>
          )}
        </StyledNav>
        <Button
          variant="outline-light"
          className="ms-3 btn-cart"
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          🛒Carrito
        </Button>
      </div>
      <CartDropdown $isOpen={isCartOpen}>
        <h2>Carrito de Compras</h2>
        {cart.length === 0 ? (
          <p>No hay productos en el carrito</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <span>
                  {item.title} <br /> (SKU: {item.sku})
                </span>
                <div className="divContent">
                  <button
                    onClick={() =>
                      updateCartQuantity(item.id, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
                <strong>
                  Total: ${(item.price * item.quantity).toLocaleString("es-AR")}
                </strong>
                <button onClick={() => removeFromCart(item.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <button onClick={sendCartToWhatsApp}>Enviar por WhatsApp</button>
        )}
      </CartDropdown>
    </StyledNavbar>
  );
}

export default NavBar;
