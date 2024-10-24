const express = require('express');
const axios = require('axios');
const path = require('path'); // Añadido el módulo path
const app = express();

// Middleware para servir archivos estáticos y parsear JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ruta principal para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

// Endpoint para obtener las monedas soportadas
app.get('/currency', async (req, res) => {
  const type = req.query.type || 'buy'; // Parametro opcional 'buy' o 'sell'

  try {
    const response = await axios.get('https://api.onramper.com/supported', {
      headers: {
        'Authorization': 'pk_prod_01J8SF5F5EWYY7Z6W7AV1KW1Q5' // API key en el header
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

// Endpoint para verificar que el servidor está funcionando
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Iniciar servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the application`);
});
