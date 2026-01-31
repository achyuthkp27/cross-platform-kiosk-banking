# JVM Metrics: The Heartbeat of Java

> [!IMPORTANT]
> The Java Virtual Machine (JVM) manages memory and threads for you. Monitoring it is critical to prevent **Out of Memory (OOM)** crashes and **Slow Performance**.

---

## 1. Memory Metrics (The Heap)

The "Heap" is where your objects live.

| Metric Name           | Description                   | Healthy Behavior                               |
| :-------------------- | :---------------------------- | :--------------------------------------------- |
| **Heap Memory Usage** | Total memory used by objects. | Sawtooth pattern (rises, then drops after GC). |
| **Non-Heap Memory**   | Metaspace (Class metadata).   | Stable, grows slowly on startup then flattens. |

### ⚠️ Warning Signs

- **Memory Leak**: The "valleys" of the sawtooth keep getting higher over time.
- **OOM Kill**: Usage hits 100% and stays there until crash.

---

## 2. Garbage Collection (GC)

GC is the process of cleaning up unused objects.

- **GC Time / Pause Duration**: How long the app "freezes" to clean memory.
    - _Good_: < 50ms per pause.
    - _Bad_: > 500ms (Stop-the-world pauses).
- **GC Frequency**: How often it runs.
    - _Bad_: Running constantly (Thrashing) means you are out of memory.

**PromQL to check GC Time:**

```promql
rate(jvm_gc_pause_seconds_sum[1m])
```

---

## 3. Thread Metrics

| Metric            | What it means                                                         |
| :---------------- | :-------------------------------------------------------------------- |
| **Thread Count**  | Total active threads. Sudden spikes = trouble.                        |
| **Thread States** | `RUNNABLE` (Working), `BLOCKED` (Waiting for lock), `WAITING` (Idle). |

> [!CAUTION]
> If **BLOCKED** threads spike, you likely have a **Deadlock** or a slow database holding connections open.

---

## 4. Class Loading

- **Class Loading Count**: Number of classes loaded into memory.
- **Unloaded Class Count**: Should increase if you do hot-reloading or dynamic scripting.

---

## 5. Visualizing in Grafana

1. Go to **JVM (Micrometer)** Dashboard.
2. Look at the **"Memory"** row first.
3. Look at **"Garbage Collection"** row second.
4. If CPU is high, check **"Threads"** to see if they are stuck processing.
