const amqplib = require("amqplib");

async function bootstrap() {
  const connection = await amqplib.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue("task");
  channel.consume("task", function (content) {
    console.log(JSON.parse(content.content.toString()));
    channel.ack(content);
  });
}

bootstrap();
