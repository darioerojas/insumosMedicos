import React, { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Ocupa toda la altura de la pantalla */
  background-color: #f8f9fa; /* Fondo suave */
`;

const LoginBox = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px 30px;
  text-align: center;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #343a40;
  }

  p {
    color: #dc3545; /* Rojo para errores */
    font-size: 0.9rem;
    margin-bottom: 15px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #80bdff;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <h2>Iniciar Sesión</h2>
        {error && <p>{error}</p>}
        <Form onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Contraseña:</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Ingresar</Button>
        </Form>
      </LoginBox>
    </LoginContainer>
  );
}

export default Login;