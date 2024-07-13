# Scheduler Microservice

This is a simple scheduler microservice built with Nest.js and Prisma.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure the database connection in the `.env` file
4. Run Prisma migrations: `npx prisma migrate deploy`
5. Run the application: `npm run start:dev`

## API Endpoints

- **GET /jobs:** List all jobs
- **GET /jobs/:id:** Retrieve a specific job by ID
- **POST /jobs:** Create a new job

## Scaling Considerations

- **Horizontal Scaling:** Use a load balancer.
- **Database Scaling:** Implement database replication and sharding.
- **Caching:** Use Redis or Memcached.
- **Message Queues:** Integrate RabbitMQ or Kafka.
