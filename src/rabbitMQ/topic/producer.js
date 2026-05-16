const { getChannel } = require("../connection");

async function publishTopicMessage(routingKey, msg) {
  const channel = getChannel();
  const exchange = "topic_notifications";

  // 1. Declare Topic Exchange
  await channel.assertExchange(exchange, "topic", { durable: true });

  // 2. Publish with routing key (this is the magic)
  await channel.publish(
    exchange,
    routingKey, // e.g., "course.nodejs.offer"
    Buffer.from(JSON.stringify(msg)), // Converted in binary formate the msg payload by Buffer.from() method.
    {
      persistent: true,
    },
  );

  console.log(`[Topic] Published → ${routingKey}`, msg);
}

module.exports = { publishTopicMessage };
