const { connectRabbitMQ } = require("./rabbitMQ/connection");
const {
  startTestConsumer,
  startNotificationConsumer,
} = require("./rabbitMQ/consumer");
const { startPushConsumer } = require("./rabbitMQ/fanout/fanout-consumer");
const {
  sendBroadcastNotification,
} = require("./rabbitMQ/fanout/fanout-producer");
const {
  sendTestMessage,
  sendNotificationToUser,
} = require("./rabbitMQ/producer");

async function start() {
  await connectRabbitMQ();
  //   await sendTestMessage(); // test send
  // await sendNotificationToUser(
  //   Math.random(20),
  //   "Initial push notification by rabbitMQ",
  //   "push",
  // );
  // //   await startTestConsumer();
  // await startNotificationConsumer();

  // Fanout
  await sendBroadcastNotification({
    type: "course_launch",
    title: "New Course: Advanced Node.js",
    message: "Enroll now and get 30% off!",
    data: { courseId: "123" },
  });

  await startPushConsumer();
}

start();
