const express = require("express");
const app = express();
const PORT = 3000;

const orderRoutes = require("./routes/orderRoutes");
require("./configs/database");

app.use(express.json());

app.use("/", orderRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});