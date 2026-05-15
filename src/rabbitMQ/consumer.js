const { getChannel } = require("./connection");

async function startTestConsumer() {
  const channel = getChannel();
  const queue = "test_queue";

  await channel.assertQueue(queue, { durable: true });
  channel.prefetch(1);

  console.log("Waiting for message...");

  channel.consume(queue, async (msg) => {
    console.log("Message from consumer", msg);
    if (msg !== null) {
      const convertString = msg.content.toString();
      console.log("toString content", convertString);
      const data = JSON.parse(convertString);

      console.log("Received message", data);

      channel.ack(msg);
    }
  });
}

async function startNotificationConsumer() {
  const channel = getChannel();
  const exchange = "notifications";
  const queue = "push_queue";

  await channel.assertExchange(exchange, "direct", { durable: true });
  await channel.assertQueue(queue, { durable: true });

  // Bind queue to exchange with routing key
  await channel.bindQueue(queue, exchange, "notify.push");

  channel.prefetch(1);

  console.log("👷 Waiting for push notifications...");

  channel.consume(queue, async (msg) => {
    // console.log(msg);
    if (msg !== null) {
      const convertString = msg.content.toString();
      const data = JSON.parse(convertString);
      console.log("the notification payload from consumer", data);
      console.log(new Date(data.date).getTime());

      // TODO: Send to Firebase / OneSignal etc.
      channel.ack(msg);
      console.log(`Close notification part for ${data.userId}`);
    }
  });
}

module.exports = { startTestConsumer, startNotificationConsumer };
