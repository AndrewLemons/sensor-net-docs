---
title: Data Flow
description: The complete path a sensor reading takes from physical measurement to dashboard visualization.
---

This page traces the journey of a single sensor reading from the moment a physical measurement is taken to the moment it appears on the monitor dashboard. Understanding this end-to-end flow ties together all the concepts in Sensor Net and demonstrates the Information Internetworks data pipeline in action.

## The Five Stages

The data flow maps directly to the five stages of the Information Internetworks pipeline:

| Stage         | What Happens                                                | Where It Happens                               |
| ------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| **Capture**   | A sensor reads a physical quantity from the environment     | Sensor node (TMP102 or BMP280 over I2C)        |
| **Represent** | The reading is encoded into a structured binary message     | Sensor node (protobuf encoding)                |
| **Transmit**  | The message is sent over radio and relayed through the mesh | All nodes (LoRa radio, mesh relay)             |
| **Transform** | Raw data is parsed, stored, and analyzed                    | Monitor application (Rust backend + analytics) |
| **Present**   | Results are displayed as charts, scores, and alerts         | Monitor application (React dashboard)          |

## Step-by-Step Walkthrough

### 1. Sensor Read (Capture)

The sensor node's `loop()` function detects that 5 seconds have passed since the last report. It calls `sensor.read()`, which communicates with the physical sensor chip over the I2C bus.

For a temperature node, this means the TMP102 driver sends a register read command over I2C and receives two bytes back, which it converts to a floating-point temperature in degrees Celsius.

The result is a `SensorReading` struct containing the value and sensor type.

### 2. Protobuf Encoding (Represent)

The firmware creates a `SensorReport` protobuf message and populates it with:

- The sensor reading (value and type)
- The node's unique ID (from the ESP32 MAC address)
- Uptime in seconds
- A transmission counter
- The firmware version string
- A unique message ID for deduplication
- Hop count of 0 (this is the origin)

The `pb_encode()` function serializes this struct into a compact binary buffer of approximately 22-30 bytes.

### 3. LoRa Transmission (Transmit)

The firmware calls `radio.send()`, which hands the binary buffer to the SX1262 radio chip over SPI. The radio modulates the data using chirp spread spectrum and transmits it on 902.25 MHz.

The transmission is a blocking call -- the firmware waits until the radio finishes transmitting before continuing. At SF7 with 500 kHz bandwidth, this takes roughly 10-20 milliseconds for a 22-byte packet.

After transmitting, the firmware immediately returns the radio to receive mode by calling `radio.startListening()`.

### 4. Mesh Relay (Transmit continued)

If other sensor nodes are in range, they receive the packet. Each node performs the mesh relay check:

1. Decode the incoming packet enough to extract `msg_id` and `hops`.
2. Check `hasSeen(msg_id)` -- if already seen, drop the packet.
3. Check `hops < MESH_MAX_HOPS` -- if the hop limit is reached, drop the packet.
4. If both checks pass, mark `msg_id` as seen, increment `hops`, and schedule a relay after a random jitter delay.

This process repeats at each relay node, extending the packet's reach through the network.

### 5. Receiver Decode

The receiver node is continuously listening. When a packet arrives (signaled by the DIO1 interrupt), the receiver:

1. Reads the raw bytes from the radio, along with the RSSI and SNR signal quality metrics.
2. Decodes the protobuf message into a `SensorReport` struct.
3. Checks `hasSeen(msg_id)` -- if already seen (from a duplicate relay), drops it.
4. Updates the `PeerTracker` with the originating node's ID, RSSI, and SNR.
5. Formats a `[REPORT]` line and prints it to USB serial.

The serial output line looks like:

```
[REPORT] node=11223344 type=temperature value=23.45 unit=C rssi=-45 snr=8.5 uptime=120 tx=15 hops=0
```

### 6. Serial Read (Transform)

The monitor application's Rust backend has a background thread continuously reading lines from the USB serial port. When it reads a line:

1. The raw line is emitted to the frontend as a `serial-log` event. It appears in the Log Console.
2. The parser checks whether the line matches the `[REPORT]` regex pattern.
3. If it matches, each key-value pair is extracted and a `SensorReport` struct is built.
4. The report is inserted into the SQLite database with a timestamp.
5. A `new-report` event is emitted to the frontend.

### 7. Database Query and Analytics (Transform continued)

When the frontend's `useMonitorData` hook receives the `new-report` event, it calls five Rust commands in parallel to refresh all dashboard data:

- `get_node_summaries` -- Latest status of each node
- `get_sensor_data("temperature", limit)` -- Temperature history for charts
- `get_sensor_data("pressure", limit)` -- Pressure history for charts
- `get_recent_reports(limit)` -- Last 30 raw reports
- `get_stats` -- Aggregate metrics (total reports, node count, average RSSI/SNR)

The fresh data flows into the analytics layer, where four pure functions compute:

- **Sensor insights** -- Trend direction, rate of change, and anomaly flags for each sensor.
- **Node health** -- Signal quality assessment and online/offline status for each node.
- **System status** -- Overall health level (nominal, warning, or critical) based on all insights and node health.
- **Packet infos** -- Formatted packet display objects for the packet inspector.

### 8. Dashboard Render (Present)

React detects that the analytics results have changed (via `useMemo` dependency tracking) and re-renders only the components whose props changed. Charts update with new data points, status indicators change color if thresholds are crossed, and node cards reflect the latest signal quality.

The entire journey -- from sensor read to dashboard update -- typically completes in well under one second, limited primarily by the 5-second interval between sensor readings rather than processing time.

## Summary

| Step                  | Component              | Technology                  |
| --------------------- | ---------------------- | --------------------------- |
| Read sensor           | Sensor node firmware   | I2C, TMP102/BMP280 driver   |
| Encode message        | Sensor node firmware   | Nanopb (Protocol Buffers)   |
| Transmit over radio   | Sensor node firmware   | SX1262, RadioLib, LoRa      |
| Relay through mesh    | All sensor nodes       | MeshRouter (flooding mesh)  |
| Receive and decode    | Receiver node firmware | SX1262, Nanopb              |
| Print to serial       | Receiver node firmware | USB serial at 115200 baud   |
| Read serial and parse | Monitor Rust backend   | Tauri, regex parser         |
| Store in database     | Monitor Rust backend   | SQLite                      |
| Compute analytics     | Monitor React frontend | TypeScript pure functions   |
| Render dashboard      | Monitor React frontend | React, charts, Tailwind CSS |
