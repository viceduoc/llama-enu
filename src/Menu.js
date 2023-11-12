import React from 'react';
import Product from './Product';

function Menu({ menuData, selectedCategory }) {
  const filteredMenu = selectedCategory
    ? menuData.filter((item) => item.NombreCategoria === selectedCategory)
    : menuData;


  const sortedMenu = filteredMenu.sort((a, b) => b.Destacado - a.Destacado);

  return (
    <div className="row row-cols-2">
      {sortedMenu.map((item) => (
        <div className="col" key={item.idProducto}>
          <Product product={item} />
        </div>
      ))}
    </div>
  );
}

export default Menu;
