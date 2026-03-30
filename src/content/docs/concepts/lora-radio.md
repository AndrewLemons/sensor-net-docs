---
title: LoRa Radio
description: How LoRa radio technology works and how Sensor Net uses it.
---

LoRa (Long Range) is a radio modulation technique created by Semtech. It is not Wi-Fi, Bluetooth, or cellular. It uses a technique called **chirp spread spectrum (CSS)** to spread a signal across a wide bandwidth, which makes it extremely resistant to interference and able to penetrate walls and travel several kilometers in open air.

## How Chirp Spread Spectrum Works

Most radio systems send data by encoding bits into patterns of frequency or amplitude changes at a fixed carrier frequency. LoRa takes a different approach: it encodes data into **chirps** -- signals that continuously sweep from a low frequency to a high frequency (an "up-chirp") or from high to low (a "down-chirp").

The key insight is that even if part of the chirp is corrupted by interference, the receiver can still reconstruct the full chirp and decode the data. This is what gives LoRa its long range and penetration ability.

## Key Parameters

LoRa has several configurable parameters that trade off range, data rate, and interference resistance. Sensor Net uses the following settings:

| Parameter             | Sensor Net Value | What It Controls                                                                                                       |
| --------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Frequency             | 902.25 MHz       | The center frequency of the radio signal. 902.25 MHz is in the US ISM band. Use 868.0 MHz for Europe.                  |
| Bandwidth             | 500 kHz          | How wide the frequency sweep is. Wider bandwidth means faster data rates but shorter range.                            |
| Spreading Factor (SF) | 7                | How many frequency steps are in each chirp. Higher SF means longer range but slower data rate. Range: 7-12.            |
| Coding Rate           | 4/5              | The fraction of transmitted bits that carry actual data versus error correction. 4/5 means 20% of bits are redundancy. |
| TX Power              | 21 dBm           | The transmit power (~125 mW). 21 dBm is the maximum for the SX1262 in the US band.                                     |
| Sync Word             | 0x34             | A network identifier. Only radios with the same sync word can communicate. Think of it as a channel selector.          |

## Range vs. Speed Trade-off

The most important trade-off to understand is between **spreading factor** and **data rate**:

| SF  | Approximate Data Rate (500 kHz BW) | Relative Range |
| --- | ---------------------------------- | -------------- |
| 7   | ~21.9 kbps                         | Baseline       |
| 8   | ~12.5 kbps                         | ~1.3x further  |
| 9   | ~7.0 kbps                          | ~1.6x further  |
| 10  | ~3.9 kbps                          | ~2x further    |
| 11  | ~2.1 kbps                          | ~2.5x further  |
| 12  | ~1.2 kbps                          | ~3x further    |

Each step up in SF roughly doubles the transmission time (and halves the data rate) but extends the usable range. For the small packets Sensor Net sends (22-30 bytes), even SF12 is fast enough -- each packet takes under a second to transmit.

Bandwidth also affects range. Narrower bandwidths (e.g., 125 kHz instead of 500 kHz) extend range further but slow down data transfer proportionally.

## Half-Duplex Operation

LoRa radios are **half-duplex**. This means a single radio can either transmit or receive at any given moment, but not both simultaneously. This has an important consequence for Sensor Net:

- **Sensor nodes** alternate between transmitting their own readings and listening for other nodes' packets. While transmitting, they cannot hear incoming packets.
- **The receiver node never transmits.** It stays in receive mode permanently to avoid missing any incoming packets. This is why the receiver does not relay packets.

## The SX1262 Radio Chip

All Sensor Net nodes use the **SX1262**, manufactured by Semtech. It is a modern LoRa transceiver with the following features relevant to this project:

- Operates from 150 MHz to 960 MHz (covers both US and EU bands).
- Up to +22 dBm transmit power.
- Sensitivity down to -148 dBm (with SF12, 125 kHz BW).
- Built-in packet engine with CRC checking.
- SPI interface for communication with the microcontroller.

On the Heltec WiFi LoRa 32 V3 board, the SX1262 is connected to the ESP32 via SPI (a four-wire synchronous serial bus). The firmware uses the **RadioLib** library to communicate with the chip, abstracting away the low-level SPI register reads and writes.

## Interrupt-Driven Receive

When the SX1262 finishes receiving a packet, it raises its **DIO1** pin. A short Interrupt Service Routine (ISR) running in hardware sets a flag (`rxFlag = true`). On the next iteration of the main `loop()`, the firmware detects the flag and reads the packet data from the radio. This approach avoids continuously polling the radio over SPI, keeping the main loop fast and efficient.
