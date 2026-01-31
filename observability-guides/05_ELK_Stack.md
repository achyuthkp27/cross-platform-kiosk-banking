# ELK Stack: Kibana, Logging & Tracing

> [!NOTE]
> Metrics tell you **"What"** happened.
> Logs tell you **"Why"** it happened.
> Traces tell you **"Where"** it happened.

---

## 1. The Stack Components

- **Elasticsearch**: The database that stores the logs.
- **Logstash / Filebeat**: The shipper that reads logs from files (`server.log`) and sends them to ES.
- **Kibana**: The UI to search and visualize.

---

## 2. Kibana: How to Hunt Errors

1. **Discover Tab**: The main search interface.
2. **Select Index**: `filebeat-*`.
3. **Search Bar**: Supports **KQL (Kibana Query Language)**.

### 🔍 Best Search Queries

**Find all Errors:**

```text
log.level : "ERROR"
```

**Find a specific Request ID (Tracing):**

```text
mdc.requestId : "123e4567-e89b-..."
```

**Find suspicious Auth failures:**

```text
message : *"Authentication Failed"* OR message : *"Access Denied"*
```

**Find Slow DB Queries:**

```text
message : *"slow query"*
```

---

## 3. Observability Signals (The Three Pillars)

### 📜 Logs

- Unstructured or Semi-structured text.
- High volume, high detail.
- **Use for**: Debugging specific exceptions, stack traces.

### 📊 Metrics

- Aggregated numbers (Counters, Gauges).
- Low volume, low detail, cheap to store.
- **Use for**: Alerting, Trending, Dashboards.

### 🔗 Traces (Distributed Tracing)

- Follows a request across microservices.
- **Trace ID**: Unique ID for the whole flow.
- **Span ID**: ID for a specific step (e.g., DB call, API call).
- **Use for**: Finding identifying latency bottlenecks in complex architectures.

### 📅 Events

- Significant point-in-time occurrences.
- Examples: "Deployment Started", "Config Changed", "Server Restarted".
- Can be overlaid on Grafana graphs to correlate with issues.

---

## 4. Structured Logging (JSON)

We configured the app to output **JSON logs**. Why?

**Bad (Text Log):**
`2026-01-31 10:00:00 INFO User 'achyuth' logged in from IP 192.168.1.1`
_Hard to search for specific IPs._

**Good (JSON Log):**

```json
{
    "timestamp": "2026-01-31T10:00:00Z",
    "level": "INFO",
    "event": "login_success",
    "user": { "id": "achyuth", "role": "admin" },
    "network": { "ip": "192.168.1.1" }
}
```

_Easy to filter: `user.id : "achyuth"`_
