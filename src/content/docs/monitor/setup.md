---
title: Monitor Setup
description: How to install dependencies and prepare the monitor application for development or building.
---

This page covers cloning the monitor application repository and installing all dependencies. Make sure you have already installed Rust, Bun, and the Tauri system dependencies as described in the [Software Prerequisites](/getting-started/software-prerequisites/) page.

## Clone the Repository

```sh
git clone https://github.com/AndrewLemons/sensor-net-monitor.git
cd sensor-net-monitor
```

## Install JavaScript Dependencies

Use Bun to install the frontend packages:

```sh
bun install
```

This installs all packages listed in `package.json` into a `node_modules/` directory. The Rust backend dependencies are downloaded automatically the first time you build.

## Verify Your Environment

Before running the app, verify each prerequisite:

```sh
rustc --version    # Should print a version number
bun --version      # Should print a version number
```

On macOS, also confirm Xcode command line tools are installed:

```sh
xcode-select -p    # Should print a path like /Library/Developer/CommandLineTools
```

## Project Layout

After cloning and installing, the repository is organized as follows:

```
sensor-net-monitor/
  src/                          # React/TypeScript frontend
    App.tsx                     # Root component
    main.tsx                    # Entry point
    index.css                   # Global styles (Tailwind)
    types.ts                    # TypeScript type definitions
    analytics/                  # Pure analytics functions
      index.ts                  # Re-exports
      thresholds.ts             # Tunable alert constants
      trends.ts                 # Trend detection
      insights.ts               # Anomaly detection
      node-health.ts            # Node connectivity scoring
      system-status.ts          # Aggregate system health
      helpers.ts                # Formatting utilities
      packets.ts                # Packet display formatting
    components/                 # React UI components
      SerialConnect.tsx         # Port selection toolbar
      SystemStatusBanner.tsx    # Overall health banner
      InformationPipeline.tsx   # Data pipeline visualization
      StatsCards.tsx            # Summary metric cards
      SensorChart.tsx           # Line charts for sensor data
      DerivedInsights.tsx       # Trend and anomaly display
      NetworkMap.tsx            # Mesh topology visualization
      NodeCards.tsx             # Per-node status cards
      PacketInspector.tsx       # Packet table
      ReportTable.tsx           # Raw report table
      LogConsole.tsx            # Serial log display
      ui/                      # shadcn/ui primitives
    hooks/
      useSerial.ts              # Serial connection state
      useMonitorData.ts         # Database data fetching
  src-tauri/                    # Rust/Tauri backend
    src/
      main.rs                   # Binary entry point
      lib.rs                    # All backend logic
    Cargo.toml                  # Rust dependencies
    tauri.conf.json             # Tauri app configuration
  package.json                  # JavaScript dependencies
  vite.config.ts                # Vite bundler configuration
  tsconfig.json                 # TypeScript configuration
  index.html                    # HTML entry point
```

## Next Step

With everything installed, head to [Running the App](/monitor/running/) to start the application.
