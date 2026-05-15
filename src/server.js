const { connectRabbitMQ } = require("./rabbitMQ/connection");
const {
  startTestConsumer,
  startNotificationConsumer,
} = require("./rabbitMQ/consumer");
const {
  sendTestMessage,
  sendNotificationToUser,
} = require("./rabbitMQ/producer");

async function start() {
  await connectRabbitMQ();
  //   await sendTestMessage(); // test send
  await sendNotificationToUser(
    Math.random(20),
    "Initial push notification by rabbitMQ",
    "push",
  );
  //   await startTestConsumer();
  await startNotificationConsumer();
}

start();
