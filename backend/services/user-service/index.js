const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.get('/health', (req, res) => {
  res.json({ status: 'User Service is running' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});