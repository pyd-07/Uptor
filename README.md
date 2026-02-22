
---

# Uptor

Uptor is a full-stack uptime monitoring platform that tracks endpoint health, measures latency, and sends alert notifications when services go down or recover.

It is built as a production-ready MVP with background workers, retry logic, alert state transitions, and real-world failure handling.

---

## Live Deployment

Frontend: [https://uptor.vercel.app](https://uptor.vercel.app) \
Backend: [https://uptor.onrender.com](https://uptor.onrender.com)

---

## Core Features

* Monitor any HTTP/HTTPS endpoint
* Configurable interval and timeout per monitor
* Background uptime worker
* Automatic retry logic for transient failures
* Alert worker with state transitions
* Email notifications via Resend
* Down → Recovery transition detection
* Dashboard with aggregated uptime stats
* Authenticated organizations
* Rate-limited authentication routes
* Health check endpoint

---

## Architecture Overview

Monorepo structure:

```
apps/web         → Next.js frontend (App Router)
backend          → Express API
workers          → Background workers (uptime + alerts)
services         → Core services (HTTP check, alert logic)
utils            → Email provider wrapper
db.js            → MongoDB connection
```

### System Components

1. Express API

    * Auth
    * Monitor CRUD
    * Alerts
    * Dashboard aggregation

2. Uptime Worker

    * Runs on interval
    * Executes HEAD requests
    * Applies retry policy
    * Updates monitor state

3. Alert Worker

    * Processes pending alerts
    * Atomic state transitions
    * Retry with cap
    * Sends via Resend

---

## Technology Stack

Frontend:

* Next.js (App Router)
* TypeScript
* Axios
* TailwindCSS

Backend:

* Node.js
* Express
* MongoDB + Mongoose
* p-limit (controlled concurrency)
* Resend (email delivery)

Deployment:

* Vercel (Frontend)
* Render (Backend + Workers)

---

## Monitor State Model

Each monitor transitions between:

```
up → down → recovery
```

Status classification:

* 200–399 → up
* 400–599 → down
* Network failure → down
* Unexpected state → unknown

Retry logic:

* Up to 3 attempts per check
* Timeout and transient network errors retried
* Final state persisted after retry exhaustion

---

## Alert Lifecycle

Alerts follow a strict state machine:

```
pending → processing → sent
pending → processing → failed
```

Rules:

* Max 3 attempts
* Atomic claim before processing
* No duplicate sends after success
* Stale protection against stuck processing

---

## Environment Variables

Backend:

```
MONGO_URI=
SECRET=
RESEND_API_KEY=
FROM_EMAIL=
FRONTEND_URL=
```

Frontend:

```
NEXT_PUBLIC_URL=https://your-backend-url
```

---

## Local Development

### Backend

```
npm install
node backend/server.js
```

### Workers

```
node workers/uptimeWorker.js
node workers/alertWorker.js
```

### Frontend

```
cd apps/web
npm install
npm run dev
```

---

## Health Check

```
GET /health
```

Response:

```
{
  "status": "ok",
  "time": "ISO_TIMESTAMP"
}
```

---

## Stability Design Considerations

* Crash listeners for unhandledRejection and uncaughtException
* Retry caps on HTTP and alert delivery
* Concurrency limiting using p-limit
* Atomic DB updates during alert transitions
* CORS configured for multi-origin deployment
* Cookie-based authentication
* Memory-safe interval scheduling
* Soak tested under continuous load

---

## Deployment Notes

* Backend requires trust proxy enabled
* CORS must include frontend origin
* Workers run within backend process (Render)
* Cookies use secure + sameSite settings in production

---

## Testing Strategy

Soak tests include:

* Mixed stable and failing domains
* DNS failures
* Timeout simulations
* Rapid toggle/delete stress

---

## Roadmap

* Distributed worker locking
* Webhook alerts
* Slack/Discord integrations
* Historical uptime percentage graph
* Incident timeline view
* Multi-region checks
* Rate-limit per organization

---
