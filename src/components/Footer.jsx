import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #343a40; /* Mismo color que el Navbar */
  color: white;
  text-align: center;
  padding: 10px 20px;
  font-size: 0.9rem;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }

  .footer-links {
    display: flex;
    gap: 20px;

    a {
      color: #adb5bd;
      text-decoration: none;
      font-size: 0.9rem;

      &:hover {
        color: white;
        text-decoration: underline;
      }
    }
  }

  .contact {
    font-size: 1rem;
  }
`;

function Footer() {
  return (
    <StyledFooter>
      <div className="contact">Contacto: +54 261 374-3475</div>
      {/*<div className="footer-links">
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          Políticas de Privacidad
        </a>
        <a href="/terms" target="_blank" rel="noopener noreferrer">
          Términos de Servicio
        </a>
        <a href="/help" target="_blank" rel="noopener noreferrer">
          Ayuda
        </a>
      </div>*/}
    </StyledFooter>
  );
}

export default Footer;