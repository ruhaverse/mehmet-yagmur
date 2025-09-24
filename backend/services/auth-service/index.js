const express = require('express');

const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service is running' });
});

const PORT = 3101;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});