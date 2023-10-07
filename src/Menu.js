import React from 'react';
import Product from './Product';

function Menu({ menuData, selectedCategory }) {
  const filteredMenu = selectedCategory
    ? menuData.filter((item) => item.idCategoria === selectedCategory)
    : menuData;

  return (
    <div className="row row-cols-2">
      {filteredMenu.map((item) => (
        <div className="col" key={item.idProducto}>
          <Product product={item} />
        </div>
      ))}
    </div>
  );
}

export default Menu;
