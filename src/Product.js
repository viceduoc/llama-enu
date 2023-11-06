import React from 'react';
import { FaStar } from 'react-icons/fa'; // Import the star icon

function Product({ product }) {
  const isDestacado = product.Destacado === 1;

  return (
    <div className="card mb-3 border border-white" style={{ maxWidth: '540px' }}>
      <div className="row g-0">
        <div className="col-md-4">
          <img src={product.ProductoUrl} className={`img-fluid rounded-circle photo ${isDestacado ? 'glow-effect' : ''}`} alt={product.NombreProducto} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">
              {isDestacado && <FaStar className="text-warning" />} {/* Conditionally render the star */}
              {product.NombreProducto}
            </h5>
            <p className="card-text d-none d-md-block">
              {product.Descripcion}
            </p>
            <p className="card-text"><small className="text-body-secondary">${product.Precio}</small></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
