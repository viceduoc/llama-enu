import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Categories from './Categories';
import { fetchMenuData } from './services/api';

function App() {
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para la carga

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
      });
  }, []);

  return (
    <div className="container my-4 text-center">
      <h1 className="my-5">Nombre del Restaurante</h1>
      {loading ? ( // Muestra una indicación de carga si loading es verdadero
        <h5 className= "gold">Cargando...</h5>
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
