import React, { useState } from 'react';

function Categories({ categories, onCategoryClick }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategoryClick(category);
  };

  const handleShowAllClick = () => {
    setSelectedCategory(null);
    onCategoryClick(null);
  };

  return (
    <div className="d-flex flex-wrap justify-content-center"> {/* Utilizamos flex-wrap para que los botones se envuelvan en filas */}
      <button
        onClick={handleShowAllClick}
        className={`filter-btn  ${!selectedCategory ? 'active' : ''}`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`filter-btn  ${selectedCategory === category ? 'active' : ''}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default Categories;
