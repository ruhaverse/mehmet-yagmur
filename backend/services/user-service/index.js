const express = require('express');

const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.get('/health', (req, res) => {
  res.json({ status: 'User Service is running' });
});

const PORT = 3102;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});