const express = require('express');

const app = express();
app.use(express.json());
app.set('trust proxy', true);

app.get('/health', (req, res) => {
  res.json({ status: 'Post Service is running' });
});

const PORT = 3103;
app.listen(PORT, () => {
  console.log(`Post Service running on port ${PORT}`);
});