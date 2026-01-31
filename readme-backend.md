# Kiosk Banking Backend System

## 🚀 Overview

The **Kiosk Backend** is a high-security, bank-grade transactional system designed for reliability, observability, and "Zero Trust" security. It serves as the core processing engine for Kiosk banking operations, handling authentication, fund transfers, bill payments, and audit logging.

It is built with **Spring Boot 3** and enforces strict security protocols including end-to-end payload encryption and circuit breakers for external integrations.

---

## 🛠️ Technology Stack

| Component         | Technology              | Description                                   |
| :---------------- | :---------------------- | :-------------------------------------------- |
| **Framework**     | Spring Boot 3.2.2       | Core application framework (Java 17).         |
| **Database**      | PostgreSQL              | Primary transactional store (ACID).           |
| **Security**      | Spring Security + JJWT  | Stateless JWT authentication.                 |
| **Resilience**    | Resilience4j            | Circuit Breakers, Rate Limiters, Retry logic. |
| **Observability** | Micrometer + Prometheus | Metrics collection.                           |
| **Logging**       | ELK Stack (Filebeat)    | Structured JSON logging.                      |
| **Encryption**    | AES-256-GCM + HKDF      | Payload encryption (RFC 5869).                |

---

## 🛡️ Key Security Features

### 1. Zero Trust Architecture

- **Backend-Authoritative Session**: Frontend state is ignored; only the Backend JWT is trusted.
- **Rate Limiting**:
    - `Bucket4j` implementation.
    - **Login**: 5 requests / minute per IP.
    - **Suspicious Activity**: Automatic 429 blocking on spikes.

### 2. End-to-End Encryption (E2E)

- **Mode**: Enabled via `X-Encryption-Mode: TRUE`.
- **Implementation**:
    - Requests and Responses are transparently encrypted/decrypted using `EncryptionFilter`.
    - Keys are derived per-request using HKDF (HMAC-based Extract-and-Expand Key Derivation Function).
    - Algorithm: `AES/GCM/NoPadding`.

### 3. Idempotency (Replay Protection)

- **Header**: `Idempotency-Key` (UUID).
- **Mechanism**: `IdempotencyFilter` caches response for successful mutations (POST/PUT).
- **Storage**: Redis-backed (simulated via Postgres `IdempotencyRecord` for this MVP).

---

## 📊 Observability & Monitoring

The system comes with a full **Dockerized Observability Stack**.

### 1. Prometheus to Grafana (Metrics)

- **Prometheus**: Scrapes `http://localhost:8080/actuator/prometheus` every 15s.
- **Grafana**: Visualizes metrics at `http://localhost:3000`.
- **Key Dashboards**:
    - **JVM**: Heap, GC, Threads.
    - **Spring Boot**: HTTP throughput, Latency (P95/P99).
    - **Resilience4j**: Circuit breaker states.

### 2. ELK Stack (Logs)

- **Elasticsearch**: Stores logs.
- **Kibana**: Visualizes logs at `http://localhost:5601`.
- **Format**: Logs are written to `server.log` in **JSON format** with MDC contexts (`requestId`, `userId`) for tracing.

---

## 🚦 Setup & Running

### Prerequisites

- Java 17+
- Docker Desktop
- Maven

### Steps

1. **Start Infrastructure (Databases & Observability)**

    ```bash
    docker-compose up -d
    ```

    _Waits for Postgres, Prometheus, Grafana, Elasticsearch to be healthy._

2. **Configure Environment**
   Ensure `src/main/resources/application.properties` points to localhost DB.

3. **Run Backend**

    ```bash
    cd backend
    mvn spring-boot:run
    ```

4. **Verify Health**
    ```bash
    curl http://localhost:8080/actuator/health
    # {"status":"UP"}
    ```

---

## 📂 Project Structure

```text
backend/
├── src/main/java/com/kiosk/backend/
│   ├── config/          # Security, Async, WebConfig
│   ├── controller/      # REST Endpoints
│   ├── entity/          # JPA Entities
│   ├── exception/       # GlobalErrorHandler, ApiError
│   ├── filter/          # Encryption, RateLimit, Idempotency Filters
│   ├── repository/      # Spring Data Repositories
│   ├── security/        # JWT Filter, UserDetails
│   └── service/         # Business Logic (Transactional)
├── src/main/resources/
│   ├── application.properties # Main Config
│   └── logback-spring.xml     # JSON Logging Config
└── pom.xml                    # Dependencies
```

---

## 🧪 Testing

### Unit Tests

```bash
mvn test
```

### Load Testing (K6)

We have a built-in K6 load test in `docker-compose`.

```bash
docker-compose up k6
```

This triggers traffic to validate Rate Limiting and Circuit Breaker thresholds.

---

## 📚 Guides

See `observability-guides/` for detailed docs on:

- [Grafana & Prometheus](../observability-guides/01_Grafana_Prometheus.md)
- [JVM Metrics](../observability-guides/02_JVM_Metrics.md)
- [ELK Stack](../observability-guides/05_ELK_Stack.md)
