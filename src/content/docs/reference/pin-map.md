---
title: Pin Map
description: Complete GPIO pin assignments for the Heltec WiFi LoRa 32 V3 in Sensor Net.
---

These pin assignments are defined in `firmware/node/include/config.h` and match the Heltec WiFi LoRa 32 V3 board's internal wiring. You should not need to change these unless you are using a different board.

## LoRa Radio (SPI)

| Constant    | GPIO | Function                                          |
| ----------- | ---- | ------------------------------------------------- |
| `LORA_NSS`  | 8    | SPI chip-select for the SX1262                    |
| `LORA_DIO1` | 14   | SX1262 interrupt pin (signals packet received)    |
| `LORA_RST`  | 12   | SX1262 hardware reset                             |
| `LORA_BUSY` | 13   | SX1262 busy signal (indicates chip is processing) |
| `LORA_SCK`  | 9    | SPI clock                                         |
| `LORA_MISO` | 11   | SPI data in (master in, slave out)                |
| `LORA_MOSI` | 10   | SPI data out (master out, slave in)               |

## I2C Bus (OLED + Sensors)

| Constant   | GPIO | Function                                            |
| ---------- | ---- | --------------------------------------------------- |
| `OLED_SDA` | 17   | I2C data line (shared by OLED, TMP102, and BMP280)  |
| `OLED_SCL` | 18   | I2C clock line (shared by OLED, TMP102, and BMP280) |
| `OLED_RST` | 21   | OLED display hardware reset                         |

## Power and Status

| Constant   | GPIO | Function                                                               |
| ---------- | ---- | ---------------------------------------------------------------------- |
| `PIN_VEXT` | 36   | Peripheral power enable (active LOW -- drive LOW to turn on 3.3V rail) |
| `PIN_LED`  | 35   | Onboard LED                                                            |

## I2C Device Addresses

These are not GPIO pins but are configured alongside the pin definitions:

| Device       | Default Address | Alternate Address | Set By                            |
| ------------ | --------------- | ----------------- | --------------------------------- |
| SSD1306 OLED | 0x3C            | --                | Fixed on board                    |
| TMP102       | 0x48            | 0x49              | ADD0 pin (GND = 0x48, VCC = 0x49) |
| BMP280       | 0x76            | 0x77              | SDO pin (GND = 0x76, VCC = 0x77)  |
