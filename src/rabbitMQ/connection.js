const amqp = require("amqplib");

let channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    console.log("RabbitMQ connected");

    return channel;
  } catch (err) {
    console.log("RabbitMQ connection failed: ", err);
    setTimeout(connectRabbitMQ(), 3000);
  }
}

module.exports = { connectRabbitMQ, getChannel: () => channel };
