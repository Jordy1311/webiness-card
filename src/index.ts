import express from 'express';
import dotenv from 'dotenv';
import dnsCron from './dns-cron';

dotenv.config();
dnsCron();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (_, res) => {
  res.send('Hello world!');
});

app.listen(port, () => {
  const timestamp: String = new Date().toLocaleString();
  console.log(`Server is listening on port: ${port} at ${timestamp}`);
});

// closes port gracefully
process.on('SIGINT', () => {
  const timestamp: String = new Date().toLocaleString();
  console.log(`\nServer is closing down port: ${port} at ${timestamp}`);
  process.exit(0);
});
