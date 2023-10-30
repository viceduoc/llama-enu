import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Categories from './Categories';
import { fetchMenuData } from './services/api';
import { Link } from 'react-router-dom';

function App() {
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [restaurantName, setRestaurantName] = useState("");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    // Llama a la función fetchMenuData desde api.js
    fetchMenuData()
      .then((data) => {
        setMenuData(data.menuData);
        setCategories(data.categories);
        setLoading(data.loading); // Actualiza el estado de carga

        if (data.menuData.length > 0) {
          setRestaurantName(data.menuData[0].NombreSucursal);
        }
      });
  }, []);

  return (
    <div className="container my-4 text-center">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Link to="/" className="btn btn-primary"><i className="fa fa-home"></i></Link>
        </div>
      </div>
      <h1 className="my-5">{restaurantName}</h1> {/* Mostramos el nombre del restaurante */}
      {loading ? (
        <h5 className="text-warning">Cargando...</h5>
      ) : (
        <>
          <div className="my-5">
            <Categories categories={categories} onCategoryClick={handleCategoryClick} />
          </div>
          <Menu menuData={menuData} selectedCategory={selectedCategory} />
        </>
      )}
    </div>
  );
}

export default App;
