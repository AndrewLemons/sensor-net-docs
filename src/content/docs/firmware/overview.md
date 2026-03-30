---
title: Firmware Overview
description: Architecture overview of the Sensor Net firmware that runs on each node.
---

The Sensor Net firmware runs on every Heltec WiFi LoRa 32 V3 board in the network. All nodes share the same codebase -- a single `#define` in the configuration file selects which role a node plays. This page explains the overall firmware architecture before you set it up, configure it, and flash it.

## Source Repository

The firmware lives in the [sensor-net-firmware](https://github.com/AndrewLemons/sensor-net-firmware) repository.

## Node Roles

Every board runs the same firmware template. Before flashing, you set the `NODE_TYPE` constant in `config.h` to select the node's role:

| Constant           | Value | Role                                                                    |
| ------------------ | ----- | ----------------------------------------------------------------------- |
| `NODE_RECEIVER`    | 0     | Listens for all packets and forwards data to a computer over USB serial |
| `NODE_TEMPERATURE` | 1     | Reads the TMP102 sensor and broadcasts temperature reports              |
| `NODE_PRESSURE`    | 2     | Reads the BMP280 sensor and broadcasts pressure reports                 |

The C preprocessor (`#if` / `#elif` / `#endif`) includes only the code relevant to the selected role. A temperature node never compiles receiver or pressure logic.

### Receiver Node

- Stays in receive mode permanently.
- Decodes every `SensorReport` it has not already seen.
- Prints the decoded report as a structured line to USB serial (read by the monitor application).
- Tracks which sensor nodes are currently active using `PeerTracker`.
- Shows live status on the OLED: number of active nodes and uptime.
- **Never relays packets.** Retransmitting would switch the radio to transmit mode and cause missed incoming packets.

### Sensor Nodes (Temperature and Pressure)

- Read the attached sensor over I2C every 5 seconds (configurable).
- Encode each reading into a `SensorReport` protobuf message and transmit it over LoRa.
- Listen for other nodes' packets between transmissions and relay any new ones, forwarding them further through the mesh.
- Show the current reading, transmission count, and uptime on the OLED.

## Firmware Modules

The firmware is organized into modular libraries, each responsible for a single concern:

| Module           | Location              | Responsibility                                                     |
| ---------------- | --------------------- | ------------------------------------------------------------------ |
| `main.cpp`       | `src/main.cpp`        | Entry point. Orchestrates `setup()` and `loop()`.                  |
| `config.h`       | `include/config.h`    | All configuration constants: node type, pins, radio, timing, mesh. |
| `RadioManager`   | `lib/RadioManager/`   | Wraps the SX1262 radio driver (init, send, receive).               |
| `MeshRouter`     | `lib/MeshRouter/`     | Seen-message table, relay decisions, message ID generation.        |
| `PeerTracker`    | `lib/PeerTracker/`    | Tracks active peers by recency (receiver only).                    |
| `DisplayManager` | `lib/DisplayManager/` | Drives the OLED display for each screen type.                      |
| `Sensor`         | `lib/Sensor/`         | Abstract sensor interface and concrete drivers (TMP102, BMP280).   |
| `proto`          | `lib/proto/`          | Nanopb-generated protobuf encode/decode code.                      |

For detailed descriptions of each module's API, see the [Firmware Modules Reference](/reference/firmware-modules/).

## The Arduino Loop Model

The firmware uses the standard Arduino two-function model:

**`setup()`** runs once on boot and initializes everything in sequence:

1. Enable the Vext power rail (GPIO 36 LOW) to power peripherals.
2. Initialize the I2C bus.
3. Derive the node ID from the ESP32's factory MAC address.
4. Initialize the OLED display and show a splash screen.
5. Initialize the LoRa radio (halt with an error if it fails).
6. Initialize the sensor (sensor nodes only; halt if it fails).
7. Put the radio into continuous receive mode.

**`loop()`** runs continuously and handles all runtime behavior:

1. Poll the radio for incoming packets.
2. If a relay is pending and its jitter delay has elapsed, transmit it.
3. Receiver: prune stale peers and update the OLED every second.
4. Sensor nodes: if 5 seconds have elapsed, take a reading and transmit. Update the OLED every second.

A critical design principle is **non-blocking code**. The `loop()` function never calls `delay()` for long periods. All timing uses `millis()` timestamps and "has enough time passed?" checks on every iteration. This keeps the loop responsive so incoming radio packets are never missed.

## Key Dependencies

The firmware uses PlatformIO to manage the following libraries:

| Library         | Version | Purpose                                       |
| --------------- | ------- | --------------------------------------------- |
| RadioLib        | ^6.4    | Unified driver for the SX1262 LoRa radio chip |
| U8g2            | ^2.35   | Graphics library for the SSD1306 OLED display |
| Nanopb          | ^0.4    | Compact protobuf encoder/decoder for C        |
| Adafruit BMP280 | ^2.6    | Driver for the BMP280 pressure sensor         |

These are declared in `platformio.ini` and downloaded automatically on first build.

## Next Step

Proceed to [Firmware Setup](/firmware/setup/) to clone the repository and prepare your development environment.
