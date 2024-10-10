const express = require('express');
const app = express();

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

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

  // Aquí podrías procesar los datos como guardar en base de datos o notificar de algún evento
  // Por ejemplo, procesar diferentes estados de la transacción
  if (status === 'completed') {
    console.log(`Transaction ${transactionId} completed.`);
    // Realiza las acciones necesarias como actualizar base de datos, etc.
  } else if (status === 'failed') {
    console.log(`Transaction ${transactionId} failed.`);
  }

  // Enviar respuesta 200 OK para confirmar que recibimos el webhook correctamente
  res.status(200).send('Webhook received');
});

// Iniciar servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
