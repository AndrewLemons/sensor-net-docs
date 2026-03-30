---
title: Serial Output
description: How to read and interpret the serial output from each node type.
---

Every Sensor Net node outputs diagnostic and data messages over USB serial at **115200 baud**. The receiver node's serial output is particularly important because it is the data that the monitor application reads. This page explains how to read the output from each node type.

## Opening the Serial Monitor

Using PlatformIO:

```sh
pio device monitor
```

Or with any serial terminal application, connect to the board's port at 115200 baud. On macOS the port looks like `/dev/tty.usbmodemXXXX`. On Windows it appears as `COM3` or similar.

## Receiver Node Output

When the receiver boots, it prints a header:

```
=== LoRa Receiver Node AABBCCDD ===
Firmware 2.0.0  |  Mesh max-hops=3

[RADIO] SX1262 ready
```

Once sensor nodes are transmitting, the receiver prints one `[REPORT]` line per received packet:

```
[REPORT] node=11223344 type=temperature value=23.45 unit=C rssi=-45 snr=8.5 uptime=120 tx=15 hops=0
[REPORT] node=55667788 type=pressure value=1013.25 unit=hPa rssi=-62 snr=5.2 uptime=300 tx=60 hops=1
```

### Report Fields

Each `[REPORT]` line contains these key=value pairs:

| Field    | Type       | Description                                                        |
| -------- | ---------- | ------------------------------------------------------------------ |
| `node`   | Hex string | Unique ID of the originating sensor node (from its MAC address)    |
| `type`   | String     | Sensor type: `temperature` or `pressure`                           |
| `value`  | Float      | The sensor reading                                                 |
| `unit`   | String     | Unit of measurement: `C` (Celsius) or `hPa` (hectopascals)         |
| `rssi`   | Integer    | Received Signal Strength Indicator in dBm (closer to 0 = stronger) |
| `snr`    | Float      | Signal-to-Noise Ratio in dB (higher = cleaner signal)              |
| `uptime` | Integer    | Seconds since the originating node last booted                     |
| `tx`     | Integer    | Total number of reports the originating node has sent              |
| `hops`   | Integer    | Number of mesh relay hops (0 = received directly)                  |

This format is intentionally machine-readable. The monitor application uses a regex parser to extract these fields from each line. See the [Serial Packet Format Reference](/reference/serial-format/) for the exact specification.

## Sensor Node Output

Temperature and pressure nodes print similar output:

```
=== LoRa Temperature Node AABBCCDD ===
[RADIO] SX1262 ready
[SENSOR] TMP102 ready
[TX] TMP102=23.45 C  #1 (22 bytes)
[TX] TMP102=23.50 C  #2 (22 bytes)
[RELAY] 55667788 hop 1 (26 bytes)
```

| Prefix     | Meaning                                                                                                                      |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `[RADIO]`  | Radio initialization status                                                                                                  |
| `[SENSOR]` | Sensor initialization status                                                                                                 |
| `[TX]`     | The node just transmitted its own sensor reading. Shows sensor name, value, unit, sequence number, and packet size in bytes. |
| `[RELAY]`  | The node relayed another node's packet. Shows the originating node ID, the hop count of the relayed packet, and packet size. |

## Understanding RSSI and SNR

Two fields in the receiver output are especially useful for diagnosing network issues:

**RSSI (Received Signal Strength Indicator)** is measured in dBm. It tells you how strong the received radio signal was.

| RSSI Range       | Signal Quality               |
| ---------------- | ---------------------------- |
| -30 to -60 dBm   | Excellent (very close range) |
| -60 to -90 dBm   | Good                         |
| -90 to -110 dBm  | Fair                         |
| -110 to -120 dBm | Weak (edge of usable range)  |
| Below -120 dBm   | At or below the noise floor  |

**SNR (Signal-to-Noise Ratio)** is measured in dB. It tells you how far the signal is above the background noise.

| SNR Range   | Signal Quality                   |
| ----------- | -------------------------------- |
| Above 5 dB  | Excellent                        |
| 0 to 5 dB   | Good                             |
| -5 to 0 dB  | Marginal (LoRa can still decode) |
| Below -5 dB | Poor (likely packet loss)        |

LoRa is unique in that it can successfully decode signals with **negative SNR** -- meaning the signal is actually below the noise floor. This is a property of the chirp spread spectrum modulation.

## Using the Hop Count

The `hops` field tells you how the packet reached the receiver:

- **hops=0** -- The receiver heard the packet directly from the originating sensor node.
- **hops=1** -- The packet was relayed once by an intermediate node.
- **hops=2** -- The packet was relayed twice.

If all packets arrive with hops=0, your nodes are all within direct radio range of the receiver. If you see hops=1 or higher, the mesh relay system is actively forwarding packets through intermediate nodes.

## Next Step

To learn how to modify the firmware and add new sensor types, see [Extending the Firmware](/firmware/extending/).
