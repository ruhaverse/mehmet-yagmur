const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.get('/health', (req, res) => {
  res.json({ status: 'Notification Service is running' });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});