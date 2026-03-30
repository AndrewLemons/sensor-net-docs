# Sensor Net Documentation

Documentation website for the Sensor Net project - a wireless mesh sensor network built on LoRa radio and ESP32 microcontrollers, with a live desktop monitoring dashboard.

Built with [Astro Starlight](https://starlight.astro.build).

## Related Repositories

- [sensor-net-firmware](https://github.com/AndrewLemons/sensor-net-firmware) -- PlatformIO firmware for the Heltec WiFi LoRa 32 V3 nodes
- [sensor-net-monitor](https://github.com/AndrewLemons/sensor-net-monitor) -- Tauri desktop application (Rust + React/TypeScript)

## Commands

All commands are run from the root of the project:

| Command       | Action                                     |
| :------------ | :----------------------------------------- |
| `bun install` | Install dependencies                       |
| `bun dev`     | Start local dev server at `localhost:4321` |
| `bun build`   | Build production site to `./dist/`         |
| `bun preview` | Preview the build locally before deploying |
