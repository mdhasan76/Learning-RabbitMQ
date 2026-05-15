const { getChannel } = require("./connection");

async function sendTestMessage() {
  const channel = getChannel();
  const queue = "test_queue";

  await channel.assertQueue(queue, { durable: true }); // create queue if not exist

  const msg = {
    type: "test",
    message: "Hello from EdTech!",
    time: new Date(),
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)), {
    persistent: true,
  });

  console.log("📤 Message sent to queue");
}

async function sendNotificationToUser(userId, message, type = "push") {
  const channel = getChannel();
  const exchange = "notifications"; // exchange name
  const routingKey = `notify.${type}`; // Routing key

  await channel.assertExchange(exchange, "direct", { durable: true }); // direct exchange;

  const payload = { userId, message, type, date: new Date() };

  await channel.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify(payload)),
    {
      persistent: true,
    },
  );
  console.log(`📤 Notification sent [${type}] to user ${userId}`);
}

module.exports = { sendTestMessage, sendNotificationToUser };
