---
title: Serial Packet Format
description: The exact format of serial report lines emitted by the receiver node.
---

The receiver node prints structured report lines to USB serial at 115200 baud. The monitor application's Rust backend parses these lines using a regex. This page documents the exact format.

## Report Line Format

Each sensor report is printed as a single line with the following structure:

```
[REPORT] node=A1B2 type=temperature value=23.45 unit=C rssi=-67 snr=8.5 uptime=3600 tx=42 hops=1
```

The `[REPORT]` prefix acts as a sentinel so the parser can distinguish sensor data from other log messages the base station emits (such as startup messages or radio status lines).

## Field Specification

Fields are space-separated key=value pairs. They always appear in the order shown below.

| Field       | Key      | Type    | Example       | Description                                                    |
| ----------- | -------- | ------- | ------------- | -------------------------------------------------------------- |
| Node ID     | `node`   | string  | `A1B2`        | Short hexadecimal ID uniquely identifying the sensor node      |
| Sensor type | `type`   | string  | `temperature` | The sensor type: `temperature` or `pressure`                   |
| Value       | `value`  | float   | `23.45`       | The numeric sensor reading                                     |
| Unit        | `unit`   | string  | `C`           | The unit of the reading: `C` (Celsius) or `hPa` (hectopascals) |
| RSSI        | `rssi`   | integer | `-67`         | Received Signal Strength Indicator in dBm (negative number)    |
| SNR         | `snr`    | float   | `8.5`         | Signal-to-Noise Ratio in dB                                    |
| Uptime      | `uptime` | integer | `3600`        | Seconds since the originating node last booted                 |
| TX count    | `tx`     | integer | `42`          | Total number of reports the originating node has sent          |
| Hop count   | `hops`   | integer | `1`           | Number of mesh relay hops (0 = heard directly)                 |

## Other Log Lines

The receiver also outputs non-report lines that are not parsed by the monitor but are displayed in the Log Console:

```
=== LoRa Receiver Node AABBCCDD ===
Firmware 2.0.0  |  Mesh max-hops=3
[RADIO] SX1262 ready
```

Any line that does not begin with `[REPORT]` is treated as a plain log message.

## Sensor Node Output

Sensor nodes output similar log lines (useful for direct debugging), but these are not read by the monitor application:

```
[TX] TMP102=23.45 C  #1 (22 bytes)
[RELAY] 55667788 hop 1 (26 bytes)
```

| Prefix    | Meaning                                     |
| --------- | ------------------------------------------- |
| `[TX]`    | The node transmitted its own sensor reading |
| `[RELAY]` | The node relayed another node's packet      |
