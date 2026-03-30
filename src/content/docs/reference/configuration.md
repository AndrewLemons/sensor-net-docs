---
title: Configuration Reference
description: Complete reference for all firmware configuration constants in config.h.
---

All firmware configuration lives in `firmware/node/include/config.h`. This page provides a complete reference for every setting.

## Node Type

| Constant           | Value | Description                                                    |
| ------------------ | ----- | -------------------------------------------------------------- |
| `NODE_RECEIVER`    | `0`   | Listens for all packets, forwards to USB serial. Never relays. |
| `NODE_TEMPERATURE` | `1`   | Reads TMP102, transmits reports, relays other nodes' packets.  |
| `NODE_PRESSURE`    | `2`   | Reads BMP280, transmits reports, relays other nodes' packets.  |

Set the active node type with:

```c
#define NODE_TYPE  NODE_RECEIVER
```

## Radio Settings

All nodes in a network **must** use identical radio settings.

| Constant                | Default  | Type  | Description                                                                                |
| ----------------------- | -------- | ----- | ------------------------------------------------------------------------------------------ |
| `LORA_FREQUENCY`        | `902.25` | float | Center frequency in MHz. 902.25 for US, 868.0 for EU.                                      |
| `LORA_BANDWIDTH`        | `500.0`  | float | Bandwidth in kHz. Options: 7.8, 10.4, 15.6, 20.8, 31.25, 41.7, 62.5, 125.0, 250.0, 500.0.  |
| `LORA_SPREADING_FACTOR` | `7`      | int   | Spreading factor. Range: 7-12. Higher = longer range, slower.                              |
| `LORA_CODING_RATE`      | `5`      | int   | Denominator of the coding rate fraction (4/x). Range: 5-8. Higher = more error correction. |
| `LORA_SYNC_WORD`        | `0x34`   | hex   | Network identifier. Only nodes with matching sync words communicate.                       |
| `LORA_TX_POWER`         | `21`     | int   | Transmit power in dBm. Range: -9 to 22 for SX1262.                                         |

## Timing

| Constant                 | Default | Unit | Description                                                      |
| ------------------------ | ------- | ---- | ---------------------------------------------------------------- |
| `REPORT_INTERVAL_MS`     | `5000`  | ms   | Interval between sensor readings and transmissions.              |
| `PEER_TIMEOUT_MS`        | `15000` | ms   | Receiver marks a node as offline after this duration of silence. |
| `PEER_PRUNE_INTERVAL_MS` | `5000`  | ms   | How often the receiver scans for stale peers.                    |
| `DISPLAY_UPDATE_MS`      | `1000`  | ms   | OLED display refresh interval.                                   |

## Mesh Parameters

| Constant               | Default | Description                                                         |
| ---------------------- | ------- | ------------------------------------------------------------------- |
| `MESH_MAX_HOPS`        | `3`     | Maximum relay hops before a packet is dropped (TTL).                |
| `MESH_SEEN_TABLE_SIZE` | `32`    | Ring buffer size for deduplication. Oldest entries are overwritten. |
| `MESH_RELAY_JITTER_MS` | `200`   | Maximum random delay (ms) before relaying to prevent collisions.    |

## Sensor Addresses

| Constant         | Default | Description                                                                |
| ---------------- | ------- | -------------------------------------------------------------------------- |
| `TMP102_ADDRESS` | `0x48`  | I2C address of the TMP102 sensor. Change to `0x49` if ADD0 is tied to VCC. |
| `BMP280_ADDRESS` | `0x76`  | I2C address of the BMP280 sensor. Change to `0x77` if SDO is tied to VCC.  |

## Pin Definitions

See the [Pin Map](/reference/pin-map/) page for the complete pin assignment table. These should not need to be changed unless you are using a different board.
