import axios from 'axios';

export async function fetchMenuData() {
  try {
    let loading = true; // Indicador de carga
    const response = await axios.get('https://llama-jykl.onrender.com/api/restaurant/atencion/carta');
    const menuItems = response.data.data;
    const uniqueCategories = [...new Set(menuItems.map((item) => item.NombreCategoria))];
    loading = false; // Cambiamos el indicador a falso cuando la carga está completa
    return { menuData: menuItems, categories: uniqueCategories, loading };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { menuData: [], categories: [], loading: false }; // En caso de error, también establecemos loading en falso
  }
}

