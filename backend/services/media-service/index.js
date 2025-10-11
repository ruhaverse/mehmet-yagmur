const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.get('/health', (req, res) => {
  res.json({ status: 'Media Service is running' });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Media Service running on port ${PORT}`);
});