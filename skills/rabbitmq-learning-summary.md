**RabbitMQ Learning Summary - EdTech Project**

**Current Status:**

- Docker RabbitMQ (with Management UI) running on Mac
- Node.js connection established using `amqplib`
- Basic Queue + Direct Exchange (`notifications`) implemented
- Producer sends messages using Exchange + Routing Key
- Multiple dedicated consumers with proper binding
- Understanding of Buffer, ack, durable, persistent, etc.

**Files Created So Far:**

- `src/rabbitmq/connection.js`
- `src/rabbitmq/producer.js`
- `src/rabbitmq/consumer.js`
- Separate consumer approach planned (`pushConsumer.js`, `emailConsumer.js`, `smsConsumer.js`)

**Key Concepts Learned:**

- Exchange vs Queue
- Routing Key + Binding
- Direct Exchange (exact match routing)
- `assertExchange`, `assertQueue`, `bindQueue`
- `channel.publish()` vs `sendToQueue()`
- Buffer handling (`msg.content.toString()`)
- `durable: true`, `persistent: true`
- `channel.ack(msg)` and `prefetch()`
- Why separate consumers for push/email/sms

**Best Practices:**

- Keep all RabbitMQ code in `src/rabbitmq/`
- Use Direct Exchange + routing keys (`notify.push`, `notify.email`, etc.)
- Dedicated queue per notification type
- Separate consumer files for different job types

**Response Style Note:**

- Keep answers short and focused
- Add short comments explaining each important line - specially rabbitMQ code
- Explain concepts clearly after code

**Next Topics Pending:**

- Fanout Exchange
- Topic Exchange
- Work Queues
- Dead Letter Exchange (DLX)
- Delayed Messages
- Production setup (error handling, connection retry, etc.)

---
