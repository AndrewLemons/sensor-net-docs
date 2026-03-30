---
title: Configuration
description: How to configure the firmware for each node type using config.h.
---

All firmware configuration lives in a single file: `firmware/node/include/config.h`. You edit this file before each build to set the node's role and tune its behavior. This page explains every setting.

## Node Type Selection

The most important setting is `NODE_TYPE`. This determines what the node does after boot:

```c
#define NODE_TYPE  NODE_RECEIVER      // 0 - Listen and forward to serial
// #define NODE_TYPE  NODE_TEMPERATURE // 1 - Read TMP102, transmit, relay
// #define NODE_TYPE  NODE_PRESSURE    // 2 - Read BMP280, transmit, relay
```

Uncomment the line for the role you want and comment out the others. You must rebuild and reflash the firmware every time you change this setting.

:::tip
If you are flashing multiple boards in sequence, a good habit is to change `NODE_TYPE`, flash, then immediately change it for the next board before you forget.
:::

## Radio Settings

These settings control the LoRa radio. **All nodes in your network must use the same radio settings** or they will not be able to communicate.

| Setting                 | Default  | Description                                                                      |
| ----------------------- | -------- | -------------------------------------------------------------------------------- |
| `LORA_FREQUENCY`        | `902.25` | Frequency in MHz. Use 902.25 for North America, 868.0 for Europe.                |
| `LORA_BANDWIDTH`        | `500.0`  | Bandwidth in kHz. Wider is faster but shorter range.                             |
| `LORA_SPREADING_FACTOR` | `7`      | Spreading factor (7-12). Higher means longer range but slower data rate.         |
| `LORA_CODING_RATE`      | `5`      | Error correction coding rate (denominator of 4/x). Higher means more redundancy. |
| `LORA_SYNC_WORD`        | `0x34`   | Network identifier. Only nodes with the same sync word hear each other.          |
| `LORA_TX_POWER`         | `21`     | Transmit power in dBm. 21 is the maximum for this chip and region.               |

:::caution
If you change any radio parameter on one node, you must change it on **every** node in the network. Mismatched settings will prevent nodes from communicating.
:::

### Choosing Radio Parameters

For most indoor demonstrations, the defaults work well. If you need more range (for example, between buildings or across a large outdoor area):

```c
#define LORA_SPREADING_FACTOR  10   // Was 7 -- longer range, slower
#define LORA_BANDWIDTH         125.0 // Was 500.0 -- narrower, longer range
```

The trade-off is data rate. At SF10 with 125 kHz bandwidth, each packet takes roughly 8 times longer to transmit than at SF7 with 500 kHz bandwidth. For the small packets Sensor Net uses (22-30 bytes), this is usually acceptable.

## Timing Settings

These settings control how often things happen:

| Setting                  | Default | Description                                                                         |
| ------------------------ | ------- | ----------------------------------------------------------------------------------- |
| `REPORT_INTERVAL_MS`     | `5000`  | Milliseconds between sensor readings and transmissions.                             |
| `PEER_TIMEOUT_MS`        | `15000` | Receiver drops a node from its active list after this many milliseconds of silence. |
| `PEER_PRUNE_INTERVAL_MS` | `5000`  | How often the receiver checks for stale peers.                                      |
| `DISPLAY_UPDATE_MS`      | `1000`  | OLED display refresh interval in milliseconds.                                      |

For a classroom demonstration, the 5-second default is a good balance between responsiveness and radio congestion. For a larger network with many nodes, consider increasing `REPORT_INTERVAL_MS` to reduce the number of packets in the air.

## Mesh Parameters

These settings control the mesh relay behavior:

| Setting                | Default | Description                                                                                            |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `MESH_MAX_HOPS`        | `3`     | Maximum number of relay hops before a packet is dropped. Acts as a time-to-live (TTL).                 |
| `MESH_SEEN_TABLE_SIZE` | `32`    | Number of message IDs stored for deduplication. Uses a ring buffer; oldest entries are overwritten.    |
| `MESH_RELAY_JITTER_MS` | `200`   | Maximum random delay in milliseconds before relaying a packet. Prevents simultaneous relay collisions. |

The default of 3 hops means a packet can travel through up to 3 intermediate nodes before being dropped. For a small network in a single room, this is more than enough. For a larger deployment spread across multiple buildings, you may want to increase it.

## Sensor Addresses

If you are using non-default I2C addresses for your sensors (for example, because you connected the address pin to VCC instead of GND), update these:

| Setting          | Default | Description                                    |
| ---------------- | ------- | ---------------------------------------------- |
| `TMP102_ADDRESS` | `0x48`  | I2C address for the TMP102 temperature sensor. |
| `BMP280_ADDRESS` | `0x76`  | I2C address for the BMP280 pressure sensor.    |

## Pin Definitions

The pin assignments in `config.h` match the Heltec WiFi LoRa 32 V3 hardware. You should not need to change these unless you are using a different board or have modified the hardware.

See the [Pin Map Reference](/reference/pin-map/) for the complete list.

## Example: Configuring a Temperature Node

Here is what `config.h` would look like for a temperature sensor node using all default settings:

```c
// Node role
#define NODE_TYPE  NODE_TEMPERATURE

// Radio (must match all nodes)
#define LORA_FREQUENCY         902.25
#define LORA_BANDWIDTH         500.0
#define LORA_SPREADING_FACTOR  7
#define LORA_CODING_RATE       5
#define LORA_SYNC_WORD         0x34
#define LORA_TX_POWER          21

// Timing
#define REPORT_INTERVAL_MS     5000

// Mesh
#define MESH_MAX_HOPS          3
#define MESH_SEEN_TABLE_SIZE   32
#define MESH_RELAY_JITTER_MS   200
```

## Next Step

With your configuration set, proceed to [Building and Flashing](/firmware/building-and-flashing/) to compile and upload the firmware.
