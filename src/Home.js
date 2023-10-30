import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">Bienvenido a la Página de Inicio</h1>
      <p className="lead">Explora nuestro restaurante y menú.</p>
      <div className="d-flex flex-column align-items-center">
        <Link to="/app" className="btn btn-primary m-2">Ver Carta</Link>
        <button className="btn btn-success m-2">Pedir Cuenta</button>
        <button className="btn btn-danger m-2">Pedir Asistencia</button>
      </div>
    </div>
  );
}

export default Home;
