import path from "path";
import express from "express";
import ip from "ip";

const app = express();

app.use(express.static(path.join(__dirname, "..", "..", "build")));

const port = 5000;

app.listen(port, () => {
  console.log(`Listening on ${port} http://localhost:${port}`);
  console.log(`Listening on ${port} http://${ip.address()}:${port}`);
});
