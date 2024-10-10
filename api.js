const axios = require('axios');

const getSupportedCurrencies = async (type = 'buy') => {
  try {
    const response = await axios.get('https://api.onramper.com/supported', {
      headers: {
        'Authorization': 'pk_prod_01HETEQF46GSK6BS5JWKDF31BT' // API key en el header
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
