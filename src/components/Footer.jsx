import React from "react";
import styled from "styled-components";
import { IoHardwareChipSharp } from "react-icons/io5";

const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #121212; /* Mismo color que el Navbar */
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
      color: #7e7cf3; /* Color neón para destacar */
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: bold;

      &:hover {
        color: white;
        text-decoration: underline;
      }
    }
  }

  .contact {
    display: flex;
    font-size: 1.3rem;
    align-items: center;
    flex-direction: row;
    gap: 5px;
  }
`;

function Footer() {
  return (
    <StyledFooter>
      <div className="contact">
        <IoHardwareChipSharp /> NovaChip
      </div>
      <div className="footer-links">
        <a
          href="https://wa.me/2616862323"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contacto por WhatsApp
        </a>
        <a href="mailto:lucianorojas260204@gmail.com">Correo de contacto</a>
      </div>
    </StyledFooter>
  );
}

export default Footer;