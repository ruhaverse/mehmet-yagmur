const express = require('express');

const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.get('/health', (req, res) => {
  res.json({ status: 'Feed Service is running' });
});

const PORT = 3104;
app.listen(PORT, () => {
  console.log(`Feed Service running on port ${PORT}`);
});