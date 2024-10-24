const axios = require('axios');

const getSupportedCurrencies = async (type = 'buy') => {
  try {
    const response = await axios.get('https://api.onramper.com/supported', {
      headers: {
        'Authorization': 'pk_prod_01J8SF5F5EWYY7Z6W7AV1KW1Q5' // API key en el header
      },
      params: { type } // Parámetro opcional con valor por defecto 'buy'
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching supported currencies:', error);
  }
};

// Llamada a la función
getSupportedCurrencies(); // Por defecto hará la solicitud con type 'buy'
