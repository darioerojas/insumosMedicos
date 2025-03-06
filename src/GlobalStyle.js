import { createGlobalStyle } from "styled-components";

// Definir estilos globales
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

  body {
    font-family: 'Orbitron', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(to right, #e55d87, #5fc3e4);
  }
`;

export default GlobalStyle;
