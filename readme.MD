## run by docker with rabbitmq ui dashboard

```
# Better version with management UI + persistence
docker run -d \
  --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -v rabbitmq_data:/var/lib/rabbitmq \
  --restart unless-stopped \
  rabbitmq:4-management
```

#### Simple Explanation:

- **Exchange** = Router / Post Office
- **Queue** = Mailbox

Producer → Puts message in the **Exchange**

Exchange → Routes message to one or more Queues (based on type: direct, fanout, topic)

**Rule of Thumb for your project:**

- **Producer** → `assertExchange()` + `publish()`
- **Consumer** → `assertQueue()` + `bindQueue()` + `consume()`

### 🏤 **Shikkha Sohay এডটেক পোস্ট অফিসের মহা হইচই গল্প** (Full RabbitMQ Adventure)

একটা ছোট শহরে **Shikkha Sohay এডটেক পোস্ট অফিস”** আছে। পোস্ট অফিসের ম্যানেজার (Exchange) সবাইকে বলে, “আমি শুধু চিঠি রাউট করি, নিজে রাখি না!”

শহরে অনেক **মেইলবক্স (Queue)** আছে — Push, Email, SMS, In-App ইত্যাদি।

---

**দিন ১: রাহিম ভাই নতুন কোর্স লঞ্চ করলেন।**

#### **১. Fanout Exchange (ব্রডকাস্ট ম্যানেজার)**

রাহিম ভাই চিঠি দিতেই ম্যানেজার চেঁচিয়ে বললেন:  
**“Fanout মোড অন!”**  
একটা চিঠি দিয়েই সব মেইলবক্সে (Push + Email + SMS) একই চিঠি পাঠিয়ে দিলো। কোনো routing key লাগলো না।  
**সবাই একসাথে লাফালাফি শুরু করলো!**

#### **২. Direct Exchange (সরাসরি ডেলিভারি)**

পরে রাহিম ভাই বললেন, “শুধু Email-এ পাঠাও”।  
ম্যানেজার routing key `notify.email` দিয়ে শুধু Email মেইলবক্সে চিঠি পাঠালেন। অন্যরা কিছুই পেল না।

#### **৩. Topic Exchange (পিনকোড মাস্টার)**

একদিন রাহিম ভাই বললেন, “যারা Node.js কোর্স কিনেছে তাদেরকে বিশেষ অফার পাঠাও”।

ম্যানেজার হেসে বললেন: **“Topic Exchange চালু!”**  
Routing key: `course.nodejs.offer`

**প্যাটার্ন:** `course.#.offer` → যেকোনো কোর্সের অফার সবাই পাবে  
**প্যাটার্ন:** `course.nodejs.*` → শুধু Node.js সম্পর্কিত সবকিছু

একটা চিঠিতেই অনেক ধরনের স্টুডেন্ট পেয়ে গেল। **সবচেয়ে পাওয়ারফুল ম্যানেজার!**

---

**রাত ২টায় বিপদ ঘটলো — বিদ্যুৎ চলে গেল!**

সবাই ভয় পেয়ে গেল। কিন্তু **Durable Exchange** ও **Durable Queue** থাকায় পোস্ট অফিস ও মেইলবক্স টিকে রইলো। আর রাহিম ভাই **persistent: true** করে চিঠি পাঠিয়েছিলেন বলে কোনো চিঠি হারায়নি। সবাই বেঁচে গেল! 😂

---

#### **৪. Work Queues (কঠিন কাজের টিম)**

কোর্স ভিডিও প্রসেসিং-এর জন্য অনেক ভারী চিঠি আসতে লাগলো।

ম্যানেজার বললেন: **“Work Queue খুলে দাও!”**  
একটা মেইলবক্সে ১০ জন কর্মচারী (consumers) বসিয়ে দিলেন। প্রত্যেকে prefetch(5) করে কাজ নিচ্ছে।  
**Round-robin** ভাবে কাজ ভাগ হয়ে যাচ্ছে। কেউ idle বসে নেই। ভারী কাজও সহজে হয়ে যাচ্ছে।

---

#### **৫. Dead Letter Exchange (DLX) — হারানো চিঠির উদ্ধারকারী অফিস**

কিছু চিঠি খারাপ হয়ে গেল (error হলো বা reject করা হলো)।

ম্যানেজার বললেন: **“চিন্তা নেই! DLX আছে!”**  
খারাপ চিঠিগুলো আলাদা DLX Exchange-এ চলে গেল। সেখানে আরেকটা টিম তাদের দেখে, লগ করে, retry করে বা স্টুডেন্টকে জানিয়ে দেয়।  
**“কোনো চিঠি পুরোপুরি হারায় না!”**

---

#### **৬. Delayed Messages (সময় মতো ডেলিভারি)**

রাহিম ভাই বললেন, “৩ ঘণ্টা পর স্টুডেন্টদের রিমাইন্ডার পাঠাও”।

ম্যানেজার একটা **delayed queue** বানিয়ে দিলেন (RabbitMQ plugin দিয়ে বা TTL + DLX ব্যবহার করে)। চিঠিটা ৩ ঘণ্টা পর অটোমেটিক সঠিক মেইলবক্সে চলে গেল।  
**“সময় মতো ডেলিভারি গ্যারান্টি!”**

---

#### **৭. Production Setup (প্রফেশনাল পোস্ট অফিস মোড)**

শেষে পোস্ট অফিস ম্যানেজার সিরিয়াস হয়ে বললেন:

- প্রতিদিন **Connection Retry** চালু রাখো (যদি পোস্ট অফিস বন্ধ হয়ে যায় তাহলে আবার চেষ্টা করবো)
- **Error Handling** খুব ভালো করো, চিঠি হারালে লগ রাখো
- **Monitoring** চালু রাখো (Management UI দেখো)
- Multiple servers + Clustering করো যাতে কখনো বন্ধ না হয়
- Config আলাদা ফাইলে রাখো

**“এখন আমাদের পোস্ট অফিস প্রোডাকশন রেডি!”**

---

**গল্পের শিক্ষা (সারাংশ):**

- **Fanout** → সবাইকে একসাথে খবর
- **Direct** → নির্দিষ্ট ঠিকানায়
- **Topic** → প্যাটার্ন অনুসারে (সবচেয়ে শক্তিশালী)
- **Work Queue** → ভারী কাজ ভাগ করে করা
- **DLX** → ফেল করা চিঠির হ্যান্ডলিং
- **Delayed** → সময় অনুযায়ী পাঠানো
- **Durable + Persistent** → বিদ্যুৎ চলে গেলেও টিকে থাকা
- **Production** → Retry, Error Handling, Monitoring

---
