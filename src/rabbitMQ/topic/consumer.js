const { getChannel } = require("../connection");

const exchange = "topic_notifications";

async function startCourseOfferConsumer() {
  const channel = await getChannel();
  const queue = "course_offers_queue";

  await channel.assertExchange(exchange, "topic", { durable: true });

  // Declare queue
  await channel.assertQueue(queue, { durable: true });

  // Bind with pattern - This is the key part
  await channel.bindQueue(queue, exchange, "course.#.offer");
  // You can bind multiple patterns to same queue if needed
  // await channel.bindQueue(queue, exchange, 'course.nodejs.*');

  channel.prefetch(5); // Good for production

  console.log(`[Topic Consumer] Waiting for course offers...`);

  channel.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());
      console.log(`[Course Offer] Received:`, content);

      // Process offer (send email, push, etc.)
      // await sendOfferNotification(content);

      channel.ack(msg); // Important
    } catch (err) {
      console.error("Error processing offer:", err);
      channel.nack(msg, false, false); // Don't requeue if failed
    }
  });
}

module.exports = { startCourseOfferConsumer };
