import express from 'express';
import dotenv from 'dotenv';
import dnsCron from './dns-cron';
import * as eta from "eta";

dotenv.config();
dnsCron();

const app = express();
const port = process.env.PORT || 3000;

app.engine("eta", eta.renderFile);
app.set("view engine", "eta");
app.set("views", "./views")
app.use(express.static('public'));

app.get("/", function (_, res) {
  res.render("home", {
    piCpuTemp: 32,
    piFanSpeed: 1200,
  });
});

app.listen(port, () => {
  const timestamp: String = new Date().toLocaleString();
  console.log(`Listening to port: ${port} at ${timestamp}`);
});

// closes port gracefully
process.on('SIGINT', () => {
  const timestamp: String = new Date().toLocaleString();
  console.log(`\nClosing down port: ${port} at ${timestamp}`);
  process.exit();
});
