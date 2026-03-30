---
title: Glossary
description: Definitions of all technical terms used in the Sensor Net documentation.
---

| Term                            | Definition                                                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BMP280**                      | A digital barometric pressure and temperature sensor by Bosch. Communicates over I2C.                                                                                     |
| **Bun**                         | A JavaScript runtime and package manager used by the monitor application.                                                                                                 |
| **Chirp Spread Spectrum (CSS)** | The modulation technique used by LoRa. Data is encoded into frequency sweeps (chirps) that are resistant to interference.                                                 |
| **DIO1**                        | A pin on the SX1262 radio chip that pulses high when a packet has been received. Used for interrupt-driven receive.                                                       |
| **ESP32**                       | A low-cost dual-core microcontroller by Espressif. Runs the Sensor Net firmware.                                                                                          |
| **Flooding mesh**               | A mesh routing strategy where every node rebroadcasts any packet it has not already seen. Simple but uses more airtime than targeted routing.                             |
| **GPIO**                        | General-Purpose Input/Output. Physical pins on a microcontroller that can be configured as digital inputs or outputs.                                                     |
| **hPa**                         | Hectopascal. A unit of atmospheric pressure. 1 hPa = 100 Pa. Standard atmosphere is approximately 1013.25 hPa.                                                            |
| **Hop**                         | One relay step in the mesh network. A packet with `hops=2` was relayed by two intermediate nodes before reaching the receiver.                                            |
| **I2C**                         | Inter-Integrated Circuit. A two-wire serial protocol (SDA + SCL) for connecting low-speed peripherals to a microcontroller.                                               |
| **ISR**                         | Interrupt Service Routine. A function triggered directly by hardware (such as the DIO1 pin going high). Runs immediately, interrupting the normal program flow.           |
| **Jitter**                      | A random delay added before retransmitting a relayed packet. Prevents multiple nodes from relaying simultaneously and causing collisions.                                 |
| **LoRa**                        | Long Range. A radio modulation technique by Semtech for low-power, long-range IoT communication.                                                                          |
| **Mesh network**                | A network topology where every node can relay packets for other nodes, extending coverage without a central router.                                                       |
| **msg_id**                      | A 32-bit unique identifier attached to each packet. Used for deduplication in the mesh. Computed as `node_id XOR sequence_counter`.                                       |
| **Nanopb**                      | A C implementation of Protocol Buffers designed for embedded systems. Generates plain C structs with no dynamic memory allocation.                                        |
| **Non-blocking**                | Code that returns immediately rather than waiting inside a `delay()` call. All timing in Sensor Net uses `millis()` checks instead of blocking delays.                    |
| **PlatformIO**                  | A build system and package manager for embedded firmware projects. Manages compilers, board support, and library dependencies.                                            |
| **Protobuf**                    | Protocol Buffers. A language-neutral binary serialization format by Google. Used for compact, versioned message encoding.                                                 |
| **Ring buffer**                 | A fixed-size FIFO data structure where new entries overwrite the oldest when the buffer is full. Used for the seen-message table.                                         |
| **RSSI**                        | Received Signal Strength Indicator. A measurement of how strong a received radio signal is, in dBm. Closer to 0 = stronger.                                               |
| **SNR**                         | Signal-to-Noise Ratio. The difference between the signal level and the background noise level, in dB. Higher = cleaner signal. LoRa can decode signals with negative SNR. |
| **SPI**                         | Serial Peripheral Interface. A four-wire high-speed serial bus used to communicate with the SX1262 LoRa radio chip.                                                       |
| **Spreading Factor (SF)**       | A LoRa parameter that controls the range vs. data rate trade-off. Range: 7 (fastest, shortest range) to 12 (slowest, longest range).                                      |
| **SQLite**                      | A lightweight, file-based relational database. The monitor application stores all sensor reports in a SQLite database.                                                    |
| **SX1262**                      | Semtech's LoRa radio transceiver chip. Used on the Heltec WiFi LoRa 32 V3 board.                                                                                          |
| **Sync word**                   | A LoRa network identifier. Only radios with the same sync word can communicate. Functions like a channel selector.                                                        |
| **Tauri**                       | A framework for building desktop applications with a web frontend (React/TypeScript) and a native backend (Rust).                                                         |
| **TMP102**                      | A 12-bit I2C digital temperature sensor by Texas Instruments. Resolution: 0.0625 degrees C.                                                                               |
| **TTL**                         | Time-To-Live. The maximum number of relay hops a packet can traverse before being dropped. Set by `MESH_MAX_HOPS`.                                                        |
| **Vext**                        | The peripheral power rail on the Heltec V3 board. Controlled by GPIO 36 (active LOW). Powers the OLED display and external peripherals.                                   |
| **Vite**                        | A fast JavaScript bundler and development server. Used by the monitor application for the React frontend.                                                                 |
