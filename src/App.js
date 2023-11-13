import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import Categories from './Categories';
import { fetchMenuData } from './services/api';
import { Link } from 'react-router-dom';
import './styles/MainContent.css';

function App() {
  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [restaurantName, setRestaurantName] = useState("");
  const [showGoBack, setShowGoBack] = useState(false); 


  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const idTransaccion = localStorage.getItem('idTransaccion');
    setShowGoBack(!!idTransaccion);

    const fetchData = () => {
      fetchMenuData()
        .then((data) => {
          setMenuData(data.menuData);
          setCategories(data.categories);
          setLoading(data.loading);
          if (data.menuData.length > 0) {
            setRestaurantName(data.menuData[0].NombreSucursal);
          }
        })
        .catch(error => {
          console.error('Error fetching menu data:', error);
        });
    };

    // Fetch data immediately and then set up the interval
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Fetch data every 1 minute

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container my-4 text-center">
      <div className="decor-top-right"></div>
          <div className="decor-top-left"></div>
      <div className="d-flex justify-content-between align-items-center">
        <div>
        {showGoBack && (
            <Link to="/" className="btn btn-outline-secondary"><i className="fa fa-home"></i></Link>
          )}
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
