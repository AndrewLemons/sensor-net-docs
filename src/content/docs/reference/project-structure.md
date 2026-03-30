---
title: Project Structure
description: File layout for both the firmware and monitor application repositories.
---

This page provides a complete file map for both repositories in the Sensor Net project.

## Firmware Repository

Repository: [sensor-net-firmware](https://github.com/AndrewLemons/sensor-net-firmware)

```
sensor-net-firmware/
|
|-- proto/
|   |-- messages.proto            Protobuf message definitions (source of truth)
|   |-- messages.options          Nanopb options (max string sizes, etc.)
|
|-- scripts/
|   |-- generate_proto.sh         Regenerate C bindings from .proto
|
|-- firmware/node/
    |
    |-- platformio.ini            Board, framework, and library dependencies
    |
    |-- include/
    |   |-- config.h              All configuration: node type, pins, radio, mesh
    |
    |-- src/
    |   |-- main.cpp              setup() and loop(); orchestrates all modules
    |
    |-- lib/
        |-- proto/
        |   |-- messages.pb.h     Generated struct definitions
        |   |-- messages.pb.c     Generated encode/decode functions
        |
        |-- RadioManager/
        |   |-- RadioManager.h    Interface: begin(), send(), receive()
        |   |-- RadioManager.cpp  SX1262 init, ISR, TX, RX
        |
        |-- MeshRouter/
        |   |-- MeshRouter.h      Interface: markSeen(), hasSeen(), shouldRelay()
        |   |-- MeshRouter.cpp    Ring buffer, relay decision, ID generation
        |
        |-- PeerTracker/
        |   |-- PeerTracker.h     Interface: update(), prune(), count()
        |   |-- PeerTracker.cpp   Peer table with swap-remove pruning
        |
        |-- DisplayManager/
        |   |-- DisplayManager.h  Interface: showStartup/Receiver/Sensor/Error()
        |   |-- DisplayManager.cpp  U8g2 rendering for each screen
        |
        |-- Sensor/
            |-- Sensor.h          Abstract base: begin(), read(), name(), unit()
            |-- TMP102Sensor.h    TMP102 temperature driver header
            |-- TMP102Sensor.cpp  I2C read, 12-bit conversion, 0.0625 C resolution
            |-- BMP280Sensor.h    BMP280 pressure driver header
            |-- BMP280Sensor.cpp  Adafruit BMP280 library wrapper, Pa to hPa
```

## Monitor Application Repository

Repository: [sensor-net-monitor](https://github.com/AndrewLemons/sensor-net-monitor)

```
sensor-net-monitor/
|
|-- src/                            React/TypeScript frontend
|   |-- App.tsx                     Root component, wires hooks to components
|   |-- main.tsx                    React app entry point
|   |-- index.css                   Global styles (Tailwind base)
|   |-- types.ts                    All TypeScript type definitions
|   |
|   |-- analytics/                  Pure analytics functions (no UI)
|   |   |-- index.ts                Re-exports all analytics
|   |   |-- thresholds.ts           Tunable alert constants
|   |   |-- trends.ts               Trend detection and rate-of-change math
|   |   |-- insights.ts             Per-sensor anomaly detection
|   |   |-- node-health.ts          Per-node connectivity and signal health
|   |   |-- system-status.ts        Aggregate system health status
|   |   |-- helpers.ts              Formatting utilities (colors, arrows, time)
|   |   |-- packets.ts              Raw report to packet display conversion
|   |
|   |-- components/                 React UI components
|   |   |-- SerialConnect.tsx       Port selection toolbar in the header
|   |   |-- SystemStatusBanner.tsx  Health status banner
|   |   |-- InformationPipeline.tsx Data pipeline stage visualization
|   |   |-- StatsCards.tsx          Summary metrics (reports, nodes, RSSI, health)
|   |   |-- SensorChart.tsx         Line charts for temperature/pressure
|   |   |-- DerivedInsights.tsx     Trend and anomaly display
|   |   |-- NetworkMap.tsx          Mesh topology visualization
|   |   |-- NodeCards.tsx           Per-node status cards
|   |   |-- PacketInspector.tsx     Packet analyzer table
|   |   |-- ReportTable.tsx         Raw report data table
|   |   |-- LogConsole.tsx          Serial log output display
|   |   |-- ui/                     shadcn/ui primitive components
|   |
|   |-- hooks/
|       |-- useSerial.ts            Serial connection state management
|       |-- useMonitorData.ts       Database data fetching and refresh
|
|-- src-tauri/                      Rust/Tauri native backend
|   |-- src/
|   |   |-- main.rs                 Binary entry point (calls lib.rs)
|   |   |-- lib.rs                  All backend logic: serial, SQLite, commands
|   |-- Cargo.toml                  Rust dependencies
|   |-- tauri.conf.json             Tauri app configuration
|
|-- package.json                    JavaScript dependencies and scripts
|-- vite.config.ts                  Vite bundler configuration
|-- tsconfig.json                   TypeScript configuration
|-- index.html                      HTML entry point for Vite
```

## Documentation Repository

Repository: [sensor-net-docs](https://github.com/AndrewLemons/sensor-net-docs)

```
sensor-net-docs/
|
|-- astro.config.mjs                Astro/Starlight configuration and sidebar
|-- package.json                    Dependencies
|-- tsconfig.json                   TypeScript configuration
|
|-- src/
    |-- content.config.ts           Content collection schema
    |-- content/
        |-- docs/                   All documentation pages (Markdown/MDX)
            |-- index.mdx           Landing page
            |-- getting-started/    Introduction, parts list, prerequisites
            |-- hardware/           Board, sensors, assembly
            |-- firmware/           Setup, configuration, building, extending
            |-- monitor/            Setup, running, dashboard, extending
            |-- concepts/           LoRa, mesh, protobuf, data flow
            |-- reference/          Config tables, pin maps, glossary
```
