const { getChannel } = require("../connection");

const FANOUT_EXCHANGE = "notifications_fanout";
const QUEUE_NAME = "push_notifications_queue";

async function startPushConsumer() {
  const channel = getChannel();

  await channel.assertExchange(FANOUT_EXCHANGE, "fanout", { durable: true });

  // declare queue
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  // Bind queue to fanout exchange (no routing key needed)
  await channel.bindQueue(QUEUE_NAME, FANOUT_EXCHANGE, "");

  channel.prefetch(10); // adjust it based on load.

  console.log(`🚀 Push consumer waiting for broadcasts...`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      console.log(
        `📱 Push Notification consumed by consumer. id is: `,
        content.data.courseId,
      );

      // TODO: Send via Firebase / OneSignal etc.

      channel.ack(msg);
    }
  });
}

module.exports = { startPushConsumer };
