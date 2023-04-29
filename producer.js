const express = require("express");
const amqplib = require("amqplib");

async function bootstrap() {
  const app = express();
  const connection = await amqplib.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue("task", { durable: true });
  global.rabbitmq = channel;
  loadRoutes(app);
  app.listen(3000, function () {
    console.log("The server is running at port 3000");
  });
}

function loadRoutes(app) {
  app.get("/", function (req, res) {
    global.rabbitmq.sendToQueue(
      "task",
      Buffer.from(JSON.stringify({ name: "boom", age: 21 }))
    );
    return res.json({ message: "load routes successfully ..." });
  });
}

bootstrap();
