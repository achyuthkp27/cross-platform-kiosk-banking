# Spring Boot / Enterprise System Metrics

> [!TIP]
> Grouping metrics prevents information overload. Use standard frameworks like **RED**, **USE**, and **Golden Signals**.

---

## 1. The Methodologies

### 🚦 Golden Signals (Google SRE)

The four signals that matter most to a user.

1. **Latency**: Time taken to serve a request.
2. **Traffic**: Demand on the system (Req/sec).
3. **Errors**: Rate of requests failing.
4. **Saturation**: How "full" the service is (Queue depth, Memory).

### 🔴 RED Metrics (For Microservices)

Best for HTTP/RPC services.

- **R**ate (Requests per second)
- **E**rrors (Failed requests)
- **D**uration (Response time)

### 🔧 USE Method (For Resources)

Best for Hardware/Infrastructure (CPU, Disk).

- **U**tilization (% time busy)
- **S**aturation (Queue length)
- **E**rrors (Hardware errors)

---

## 2. Application Metrics

| Metric                 | Details                                        |
| :--------------------- | :--------------------------------------------- |
| **Request Rate**       | `http_server_requests_seconds_count` (rate).   |
| **Error Rate**         | 5xx server errors vs 4xx client errors.        |
| **Latency / Duration** | Average is misleading! Use **Percentiles**.    |
| **Apdex Score**        | A complex score (0 to 1) of user satisfaction. |

### Percentiles (P50, P95, P99)

- **P50 (Median)**: The "typical" user experience.
- **P95**: The slow experience (worst 5%). **Optimize for this!**
- **P99**: The outliers.

- **Active Requests**: Number of requests currently being processed (Concurrency).
- **Request Queue Depth**: Requests waiting for a thread. High queue = High latency.

---

## 3. Database Metrics (The Usual Suspect)

The database is usually the bottleneck.

- **Connection Pool Usage**: Running out of HikariCP connections?
    - `hikaricp_connections_active` vs `hikaricp_connections_max`
- **Connection Wait Time**: How long a thread waits to _get_ a connection.
- **Query Latency**: How long the SQL takes to execute.
- **Deadlocks**: Two transactions waiting on each other.
- **Replication Lag**: Delay between Primary DB and Read Replica.

---

## 4. Cache Metrics (Redis/Caffeine)

- **Hit Ratio**: `Hits / (Hits + Misses)`. Should be high (> 80%).
- **Eviction Rate**: Items forced out of cache to make room. High eviction = Cache too small.
- **Cache Latency**: Time to fetch from cache. Should be sub-millisecond.

---

## 5. System Metrics

| Metric                 | Warning Limit (Approx)              |
| :--------------------- | :---------------------------------- |
| **CPU Utilization**    | > 70% sustained is dangerous.       |
| **Load Average**       | > Number of Cores = CPU Saturation. |
| **Disk I/O**           | High IOwait means disk is slow.     |
| **Network Throughput** | Saturation leads to packet loss.    |
