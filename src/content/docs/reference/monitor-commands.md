---
title: Monitor Commands
description: Reference for all Tauri commands exposed by the monitor application's Rust backend.
---

The monitor application's Rust backend exposes a set of **Tauri commands** that the React frontend calls using `invoke()`. These function like an internal API. This page documents each command.

## Serial Port Commands

| Command             | Parameters                               | Returns    | Description                                                                                                                             |
| ------------------- | ---------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `list_serial_ports` | (none)                                   | `string[]` | Returns a list of available serial port names on the system (e.g., `/dev/tty.usbmodem1101`, `COM3`).                                    |
| `connect_serial`    | `port_name: string`, `baud_rate: number` | (none)     | Opens the specified serial port and starts reading data in a background thread. The baud rate should be `115200` to match the firmware. |
| `disconnect_serial` | (none)                                   | (none)     | Signals the background read thread to stop and closes the serial port.                                                                  |
| `is_connected`      | (none)                                   | `boolean`  | Returns whether the serial port is currently open and reading.                                                                          |

## Data Query Commands

| Command              | Parameters                             | Returns             | Description                                                                                                                         |
| -------------------- | -------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `get_node_summaries` | (none)                                 | `NodeSummary[]`     | Returns the latest status of each known node: ID, last sensor type, last value, RSSI, SNR, uptime, and last-seen timestamp.         |
| `get_sensor_data`    | `sensor_type: string`, `limit: number` | `SensorDataPoint[]` | Returns historical readings for a given sensor type (e.g., `"temperature"` or `"pressure"`), ordered by timestamp. Used for charts. |
| `get_rssi_history`   | `node: string`, `limit: number`        | `RssiDataPoint[]`   | Returns RSSI values over time for a specific node.                                                                                  |
| `get_recent_reports` | `limit: number`                        | `Report[]`          | Returns the most recent raw report rows from the database. Used for the Report Table component.                                     |
| `get_stats`          | (none)                                 | `Stats`             | Returns aggregate statistics: total report count, number of distinct nodes, average RSSI, and average SNR.                          |

## Events

In addition to commands (which are request-response), the backend emits events that the frontend listens for:

| Event        | Payload             | When Emitted                                                                                                                         |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `serial-log` | `string` (raw line) | Every time a line is read from the serial port, regardless of whether it is a report or not. Consumed by the Log Console.            |
| `new-report` | (none)              | Every time a valid `[REPORT]` line is parsed and inserted into the database. Consumed by `useMonitorData` to trigger a data refresh. |

## Frontend Usage

Commands are called from the frontend using Tauri's `invoke()` function:

```typescript
import { invoke } from "@tauri-apps/api/core";

// List available ports
const ports: string[] = await invoke("list_serial_ports");

// Connect to a port
await invoke("connect_serial", {
	portName: "/dev/tty.usbmodem1101",
	baudRate: 115200,
});

// Query data
const nodes = await invoke("get_node_summaries");
const tempData = await invoke("get_sensor_data", {
	sensorType: "temperature",
	limit: 100,
});
```

Events are listened to using Tauri's event API:

```typescript
import { listen } from "@tauri-apps/api/event";

const unlisten = await listen("serial-log", (event) => {
	console.log("Raw line:", event.payload);
});

const unlistenReport = await listen("new-report", () => {
	// Refresh dashboard data
});
```

## Database Schema

The commands above query a single SQLite table. See below for the full schema:

```sql
CREATE TABLE reports (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    node        TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value       REAL NOT NULL,
    unit        TEXT NOT NULL,
    rssi        INTEGER NOT NULL,
    snr         REAL NOT NULL,
    uptime      INTEGER NOT NULL,
    tx_count    INTEGER NOT NULL,
    hop_count   INTEGER NOT NULL,
    timestamp   TEXT NOT NULL
);

CREATE INDEX idx_node ON reports(node);
CREATE INDEX idx_sensor_type ON reports(sensor_type);
CREATE INDEX idx_timestamp ON reports(timestamp);
```

The database file location varies by operating system:

| OS      | Path                                                  |
| ------- | ----------------------------------------------------- |
| macOS   | `~/Library/Application Support/lora-monitor/data.db`  |
| Windows | `C:\Users\<You>\AppData\Roaming\lora-monitor\data.db` |
| Linux   | `~/.local/share/lora-monitor/data.db`                 |
