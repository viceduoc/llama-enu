import axios from 'axios';

export async function fetchMenuData() {
  try {
    let loading = true; // Indicador de carga
    const response = await axios.get('https://llama-jykl.onrender.com/api/restaurant/atencion/carta/1');
    const menuItems = response.data.data;
    const uniqueCategories = [...new Set(menuItems.map((item) => item.NombreCategoria))];
    loading = false; // Cambiamos el indicador a falso cuando la carga está completa
    return { menuData: menuItems, categories: uniqueCategories, loading };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { menuData: [], categories: [], loading: false }; // En caso de error, también establecemos loading en falso
  }
}

//const API_BASE_URL = 'http://localhost:8081/api/restaurant/transaccion';
const API_BASE_URL = 'https://llama-jykl.onrender.com/api/restaurant/transaccion';

export const postTransaction = (idSucursal, mesaUUID) => {
  return axios.post(`${API_BASE_URL}/transacc`, {
    mesaUID: mesaUUID,
    idSucursal: idSucursal,
  });
};


export const getTransactionStatus = (idTransaccion) => {
  return axios.post(`${API_BASE_URL}/transacc/estados`, {
    id: idTransaccion,
  });
};

export const getTransactionById = (idTransaccion) => {
  return axios.get(`${API_BASE_URL}/transacc/${idTransaccion}`);
};

export const updateTransaction = (id, resuelto, asistencia, pideCuenta) => {
  return axios.put(`${API_BASE_URL}/transacc`, {
    id,
    resuelto,
    asistencia,
    pideCuenta
  });
};

export const calificarTransaction = (idTransaccion, calificacion, comentario) => {
  return axios.put(`${API_BASE_URL}/transacc/calificar`, {
    idTransaccion : idTransaccion,
    calificacion : calificacion,
    comentario : comentario
  });
};