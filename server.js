const express = require('express');
const axios = require('axios');
const app = express();

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Webhook para recibir las notificaciones de transacciones de Onramper
app.post('/webhook', (req, res) => {
  const {
    apiKey,
    country,
    inAmount,
    onramp,
    onrampTransactionId,
    outAmount,
    partnerContext,
    paymentMethod,
    sourceCurrency,
    status,
    statusDate,
    targetCurrency,
    transactionHash,
    transactionId,
    transactionType,
    walletAddress
  } = req.body;

  // Log para verificar que los datos han sido recibidos correctamente
  console.log('Webhook data received:', req.body);

  // Procesar los datos como guardar en base de datos o notificar de algún evento
  if (status === 'completed') {
    console.log(`Transaction ${transactionId} completed.`);
  } else if (status === 'failed') {
    console.log(`Transaction ${transactionId} failed.`);
  }

  // Respuesta 200 OK para confirmar que recibimos el webhook
  res.status(200).send('Webhook received');
});


async function sendTransactionToOnramper(transactionData) {
  try {
    const endpoint = 'https://api.onramper.com/checkout/intent';
    
    const response = await axios.post(endpoint, transactionData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'pk_prod_01J8SF5F5EWYY7Z6W7AV1KW1Q5'  // Reemplaza con tu API key si es necesario
      }
    });

    console.log('Transacción exitosa:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en la transacción:', error.response?.data || error.message);
    throw error;
  }
}



app.post('/gateway', async (req, res) => {
  const {
      user, 
      email,
      amount,
      currency, 
      wallet,
      payload,
      status
  } = req.body;

  const response = {}
  // Log para verificar que los datos han sido recibidos correctamente
  console.log('gateway oonramper data received:', req.body);
  try {

    const transactionData = {
      onramp: "payfura",
      source: "eur",
      destination: "btc",
      amount: 100,
      "type": "buy",
      paymentMethod: "creditcard",
      network: "bitcoin",
      uuid: "6756256e-d07f-42f0-a873-4d992eec8a2e",
      partnerContext: "123-CLIENT-ORDER-ID-456",
      originatingHost: "buy.onramper.com",
      metaData: {
        quoteId: "01H985NH79FW951SKERQ45JMYXpayfura"
      },
      wallet: {
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
      },
      supportedParams: {
        theme: {
          isDark: false,
          themeName: "light-theme",
          primaryColor: "#241D1C",
          secondaryColor: "#FFFFFF",
          primaryTextColor: "#141519",
          secondaryTextColor: "#6B6F80",
          cardColor: "#F6F7F9",
          borderRadius: null
        },
        partnerData: {
          redirectUrl: {
            success: "http%3A%2F%2Fredirecturl.com%2F"
          }
        }
      }
    };

    
    let result = await sendTransactionToOnramper(transactionData)

    response.message = "The Onramper gateway accept your transaction"
    response.status = true
    response.data = result
  
    res.status(200).json(response);
  } catch (error) {
    console.error('Error en la transacción:', error.message);

    throw error;
  }

});

// Endpoint para obtener las monedas soportadas
app.get('/currency', async (req, res) => {
  const type = req.query.type || 'buy'; // Parametro opcional 'buy' o 'sell'

  try {
    const response = await axios.get('https://api.onramper.com/supported', {
      headers: {
        'Authorization': 'pk_prod_01HETEQF46GSK6BS5JWKDF31BT' // API key en el header
      },
      params: { type } // Parámetro opcional con valor por defecto 'buy'
    });
    
    // Enviar la respuesta con los datos de las monedas soportadas
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching supported currencies:', error);
    res.status(500).json({ error: 'Failed to fetch supported currencies' });
  }
});

// Iniciar servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
