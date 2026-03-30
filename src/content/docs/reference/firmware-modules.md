---
title: Firmware Modules
description: Reference for each firmware module's purpose and public interface.
---

The firmware is organized into modular libraries under `firmware/node/lib/`. Each module handles a single responsibility. This page documents the public interface of each module.

## RadioManager

**Location:** `lib/RadioManager/RadioManager.{h,cpp}`

Wraps the RadioLib library's SX1262 driver into a simplified interface.

### Methods

| Method             | Signature                                                            | Description                                                                                                                                                                             |
| ------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `begin()`          | `bool begin()`                                                       | Initializes SPI, creates the SX1262 driver, applies radio parameters from `config.h`, configures DIO2 as RF switch control, and attaches the DIO1 interrupt. Returns `true` on success. |
| `send()`           | `int send(uint8_t* data, uint8_t len)`                               | Transmits a buffer. **Blocking** -- returns only after transmission completes (typically 10-20 ms at SF7/500 kHz).                                                                      |
| `startListening()` | `void startListening()`                                              | Puts the radio into continuous receive mode. Re-registers the DIO1 interrupt handler (because `transmit()` clears it).                                                                  |
| `receive()`        | `int receive(uint8_t* buf, uint8_t maxLen, float* rssi, float* snr)` | **Non-blocking.** Checks the `rxFlag` set by the DIO1 ISR. If a packet is waiting, reads it into `buf` and populates RSSI/SNR. Returns byte count, or `-1` if nothing available.        |

### Interrupt Behavior

When the SX1262 finishes receiving a packet, it raises DIO1. A hardware ISR sets `rxFlag = true`. On the next `receive()` call in `loop()`, the flag is detected and the packet is read. This avoids polling the radio over SPI on every loop iteration.

## MeshRouter

**Location:** `lib/MeshRouter/MeshRouter.{h,cpp}`

Implements the mesh relay decision logic: seen-message tracking, relay eligibility, and message ID generation.

### Internal State

```cpp
uint32_t _seen[MESH_SEEN_TABLE_SIZE];  // Ring buffer of recent msg_ids
uint8_t  _head;                         // Write position in the ring buffer
uint8_t  _count;                        // Number of valid entries
static uint32_t _seqCounter;            // Monotonic sequence counter for ID generation
```

### Methods

| Method            | Signature                                          | Description                                                               |
| ----------------- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| `markSeen()`      | `void markSeen(uint32_t msg_id)`                   | Adds `msg_id` to the seen table. Overwrites the oldest entry if full.     |
| `hasSeen()`       | `bool hasSeen(uint32_t msg_id)`                    | Linear search through valid entries. Returns `true` if `msg_id` is found. |
| `shouldRelay()`   | `bool shouldRelay(uint32_t msg_id, uint32_t hops)` | Returns `true` if `hops < MESH_MAX_HOPS` AND `!hasSeen(msg_id)`.          |
| `generateMsgId()` | `uint32_t generateMsgId(uint32_t nodeId)`          | Returns `nodeId ^ (++_seqCounter)`. Guaranteed unique per node.           |

## PeerTracker

**Location:** `lib/PeerTracker/PeerTracker.{h,cpp}`

Used only by the receiver node. Maintains a table of up to 32 recently-heard sensor nodes.

### Peer Entry Structure

```cpp
struct Peer {
    uint32_t node_id;
    uint32_t last_seen_ms;   // millis() timestamp
    float    rssi;
    float    snr;
    uint32_t beacon_count;   // Total packets received from this node
};
```

### Methods

| Method     | Signature                                              | Description                                                                                                                |
| ---------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `update()` | `void update(uint32_t node_id, float rssi, float snr)` | Updates an existing peer's RSSI/SNR/timestamp and increments its counter. Adds a new entry if the node is not yet tracked. |
| `prune()`  | `void prune(uint32_t timeout_ms)`                      | Removes peers whose `last_seen_ms` is older than `timeout_ms`. Uses swap-remove for O(n) compaction.                       |
| `count()`  | `uint8_t count()`                                      | Returns the number of currently tracked peers.                                                                             |

## DisplayManager

**Location:** `lib/DisplayManager/DisplayManager.{h,cpp}`

Drives the 128x64 SSD1306 OLED display using the U8g2 library.

### Methods

| Method           | Parameters                                         | When Used                                                                                       |
| ---------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `showStartup()`  | `node_id`, `role`                                  | First 1.5 seconds after boot. Shows "LoRa Node", ID, role, firmware version.                    |
| `showReceiver()` | `node_id`, `count`, `uptime`                       | Receiver node, every second. Shows node ID, active sensor count, uptime.                        |
| `showSensor()`   | `node_id`, `name`, `value`, `unit`, `tx`, `uptime` | Sensor nodes, every second. Shows node ID, sensor name, reading (large font), TX count, uptime. |
| `showError()`    | `message`                                          | On fatal initialization failure. Shows "ERROR" and a message string.                            |

### Helper

`fmtUptime(uint32_t seconds)` converts a raw seconds count into `HH:MM:SS` format for display.

## Sensor (Abstract Interface)

**Location:** `lib/Sensor/Sensor.h`

Defines the abstract interface that all sensor drivers implement.

```cpp
class Sensor {
public:
    virtual bool          begin() = 0;  // Initialize hardware; return true on success
    virtual SensorReading read()  = 0;  // Take one reading
    virtual const char   *name()  = 0;  // Human-readable sensor name (e.g., "TMP102")
    virtual const char   *unit()  = 0;  // Unit string (e.g., "C")
};
```

### TMP102Sensor

**Location:** `lib/Sensor/TMP102Sensor.{h,cpp}`

Reads the TMP102 temperature sensor over I2C at address 0x48 (configurable). Returns temperature in degrees Celsius with 0.0625-degree resolution.

### BMP280Sensor

**Location:** `lib/Sensor/BMP280Sensor.{h,cpp}`

Reads the BMP280 pressure sensor using the Adafruit BMP280 library at address 0x76 (configurable). Returns atmospheric pressure in hectopascals.
