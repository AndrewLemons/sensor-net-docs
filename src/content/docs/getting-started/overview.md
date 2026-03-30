---
title: Overview
description: What Sensor Net is, what it teaches, and how this documentation is organized.
---

Sensor Net is a bare-bones educational platform for wireless sensor networks. It uses off-the-shelf hardware and open-source software to demonstrate how data moves from a physical sensor, through a mesh radio network, and into a live analytics dashboard on your computer.

The project was built for **Innovate ECE: The Ultimate Thread Challenge**, a competition hosted by the ECE Office of Student Engagement and Well-Being. Teams design and build small-scale projects that reflect a chosen ECE Thread. Sensor Net represents the **Information Internetworks** thread, which focuses on capturing, representing, organizing, transforming, communicating, and presenting data across distributed systems.

## What Does Sensor Net Do?

The system has three types of hardware nodes and one desktop application:

- **Sensor nodes** read physical measurements (temperature or atmospheric pressure) from attached sensors and broadcast them over long-range LoRa radio every five seconds.
- **Relay behavior** is built into every sensor node. When a node hears a packet it has not seen before, it retransmits it, extending the network's reach beyond a single radio hop.
- **A receiver node** listens for all reports and forwards structured data to a computer over USB serial.
- **The monitor application** connects to the receiver over USB, stores data in a local database, and renders a live dashboard with charts, analytics, and network health indicators.

<!-- Suggested image: a photo showing the complete system -- two or three Heltec boards with sensors attached, one connected to a laptop displaying the monitor dashboard. -->

## What You Learn

Sensor Net was designed so that every piece of the system can be read and understood by someone new to embedded systems. The table below maps each concept to where it appears in the project.

| Concept                         | Where It Appears                                  |
| ------------------------------- | ------------------------------------------------- |
| Wireless radio communication    | LoRa radio in every node                          |
| Packet encoding and decoding    | Protocol Buffers (protobuf) serialization         |
| Mesh networking                 | Flooding mesh with duplicate prevention           |
| Microcontroller I/O             | ESP32 GPIO, I2C, SPI interfaces                   |
| Sensor interfacing              | TMP102 temperature and BMP280 pressure drivers    |
| Event-driven firmware           | Non-blocking `loop()` pattern                     |
| Desktop application development | Tauri (Rust backend + React frontend)             |
| Data visualization              | Real-time charts, trend detection, anomaly alerts |
| Database storage                | SQLite for persistent historical data             |

## The Information Internetworks Thread

The Information Internetworks thread is where computing meets data enterprise. It deals with the implications of personal and organizational information management. Students in this thread learn to capture, represent, organize, transform, communicate, and present data so that it becomes meaningful information.

Sensor Net maps directly to these concepts:

| Stage         | How Sensor Net Implements It                                                        |
| ------------- | ----------------------------------------------------------------------------------- |
| **Capture**   | Sensor nodes read physical measurements from the environment using I2C sensors      |
| **Represent** | Readings are encoded into compact Protocol Buffer messages with metadata            |
| **Transmit**  | Data is broadcast over LoRa radio through a multi-hop mesh network                  |
| **Transform** | The monitor application computes trends, anomalies, and health scores from raw data |
| **Present**   | A live dashboard displays charts, node maps, and derived insights                   |

## Project Repositories

Sensor Net is split across three repositories:

| Repository                                                                 | Contents                                                  |
| -------------------------------------------------------------------------- | --------------------------------------------------------- |
| [sensor-net-firmware](https://github.com/AndrewLemons/sensor-net-firmware) | PlatformIO firmware for the Heltec WiFi LoRa 32 V3 boards |
| [sensor-net-monitor](https://github.com/AndrewLemons/sensor-net-monitor)   | Tauri desktop application (Rust + React/TypeScript)       |
| [sensor-net-docs](https://github.com/AndrewLemons/sensor-net-docs)         | This documentation site (Astro/Starlight)                 |

## How This Documentation Is Organized

This site is divided into sections that follow the order you would naturally work through the project:

1. **Getting Started** -- You are here. Learn what you need before you begin.
2. **Hardware** -- Understand the development board and sensors, then wire everything together.
3. **Firmware** -- Set up, configure, build, and flash the code that runs on each node.
4. **Monitor Application** -- Install, build, and use the desktop dashboard.
5. **Concepts** -- Deep dives into the technologies behind Sensor Net (LoRa, mesh networking, protobuf).
6. **Reference** -- Quick-lookup tables for configuration, pin maps, serial formats, and a glossary.

## Next Step

Head to the [Parts List](/getting-started/parts-list/) to see what hardware you need to purchase.
