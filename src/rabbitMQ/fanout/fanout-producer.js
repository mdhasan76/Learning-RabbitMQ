const { getChannel } = require("../connection");

const FANOUT_EXCHANGE = "notifications_fanout";

async function sendBroadcastNotification(message) {
  const channel = getChannel();

  // 1. Declare fanout exchange
  await channel.assertExchange(FANOUT_EXCHANGE, "fanout", { durable: true });

  // 2. Publish message (routing key is ignore in fanout)
  await channel.publish(
    FANOUT_EXCHANGE,
    "", // Routing key is empty/irrelavent
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true,
    },
  );

  console.log(`📢 Broadcast sent via fanout: ${message.type}`);
}

module.exports = { sendBroadcastNotification };
