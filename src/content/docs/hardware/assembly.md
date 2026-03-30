---
title: Assembly
description: Step-by-step wiring instructions for building each type of Sensor Net node.
---

This page walks through the physical assembly of each node type. The receiver node requires no external wiring. The temperature and pressure sensor nodes each require four jumper wire connections between the sensor breakout board and the Heltec board.

## Before You Begin

Gather the following for each sensor node:

- 1 Heltec WiFi LoRa 32 V3 board
- 1 sensor breakout board (TMP102 or BMP280)
- 1 small breadboard
- 4 jumper wires

Make sure the Heltec board is **not connected to USB power** while wiring.

<!-- Suggested image: photo of all components laid out on a table before assembly begins. -->

## Receiver Node

The receiver node uses **only** the Heltec board with no external wiring. Simply plug it into your computer with a USB-C cable.

The receiver node connects to the monitor application over this USB serial connection. It does not need any sensors because its sole job is to listen for incoming LoRa packets and forward them to the computer.

<!-- Suggested image: photo of a Heltec board plugged into a laptop via USB-C, showing the OLED display lit up. -->

## Temperature Node (TMP102)

The TMP102 sensor connects to the Heltec board's I2C bus using four wires. The I2C bus is shared with the onboard OLED display, which is fine because each device has a different address.

### Pin Connections

| TMP102 Pin | Heltec V3 Pin | Purpose                  |
| ---------- | ------------- | ------------------------ |
| VCC        | 3.3V          | Power supply             |
| GND        | GND           | Ground                   |
| SDA        | GPIO 17       | I2C data line            |
| SCL        | GPIO 18       | I2C clock line           |
| ADD0       | GND           | Sets I2C address to 0x48 |

The ADD0 pin sets the I2C address. Connecting it to GND gives an address of 0x48, which is the default expected by the firmware. If you connect ADD0 to VCC instead, the address changes to 0x49 and you must update `TMP102_ADDRESS` in `config.h`.

### Assembly Steps

1. Place the Heltec board and the TMP102 breakout board on the breadboard, leaving enough space between them to route wires.
2. Connect a jumper wire from the TMP102 **VCC** pin to the Heltec **3.3V** pin.
3. Connect a jumper wire from the TMP102 **GND** pin to the Heltec **GND** pin.
4. Connect a jumper wire from the TMP102 **SDA** pin to Heltec **GPIO 17**.
5. Connect a jumper wire from the TMP102 **SCL** pin to Heltec **GPIO 18**.
6. Connect the TMP102 **ADD0** pin to **GND** (this can share the same GND rail on the breadboard).

<!-- Suggested image: photo of the completed temperature node wiring on a breadboard, with wires clearly visible and labeled. -->

<!-- Suggested image: close-up photo showing the specific pin connections on both the TMP102 breakout and the Heltec header. -->

:::caution
Double-check that VCC is connected to the **3.3V** pin, not the **5V** pin. The TMP102 is a 3.3V device and can be damaged by 5V.
:::

## Pressure Node (BMP280)

The BMP280 sensor also connects over I2C with the same four data wires, though the pin labels on the breakout board may differ slightly.

### Pin Connections

| BMP280 Pin | Heltec V3 Pin | Purpose                  |
| ---------- | ------------- | ------------------------ |
| VIN        | 3.3V          | Power supply             |
| GND        | GND           | Ground                   |
| SDA        | GPIO 17       | I2C data line            |
| SCL        | GPIO 18       | I2C clock line           |
| SDO        | GND           | Sets I2C address to 0x76 |

The SDO pin sets the I2C address. Connecting it to GND gives an address of 0x76, which is the firmware default. Connecting SDO to VCC changes the address to 0x77 and requires updating `BMP280_ADDRESS` in `config.h`.

### Assembly Steps

1. Place the Heltec board and the BMP280 breakout board on the breadboard.
2. Connect a jumper wire from the BMP280 **VIN** pin to the Heltec **3.3V** pin.
3. Connect a jumper wire from the BMP280 **GND** pin to the Heltec **GND** pin.
4. Connect a jumper wire from the BMP280 **SDA** pin to Heltec **GPIO 17**.
5. Connect a jumper wire from the BMP280 **SCL** pin to Heltec **GPIO 18**.
6. Connect the BMP280 **SDO** pin to **GND** (can share the breadboard GND rail).

<!-- Suggested image: photo of the completed pressure node wiring on a breadboard. -->

:::note
Some BMP280 breakout boards label the power pin as **VCC** instead of **VIN**. Some may also have a **CSB** pin -- leave it unconnected or tie it to VCC to select I2C mode (as opposed to SPI mode).
:::

## Verifying Your Wiring

After assembly, you can verify that the sensor is correctly wired before flashing the full firmware. Connect the board to your computer via USB and use the PlatformIO serial monitor or the Arduino IDE's I2C scanner sketch to check that the sensor responds at the expected address.

Expected I2C addresses for a correctly wired node:

| Device                 | Address |
| ---------------------- | ------- |
| SSD1306 OLED (onboard) | 0x3C    |
| TMP102 (if attached)   | 0x48    |
| BMP280 (if attached)   | 0x76    |

If the sensor does not appear at the expected address, double-check your wiring -- particularly that SDA and SCL are not swapped and that the address-select pin (ADD0 or SDO) is connected to GND.

## Tips

- **Keep wires short.** Shorter I2C wires are more reliable, especially if you later increase the I2C clock speed.
- **Secure the breadboard.** The Heltec board can wiggle loose from a breadboard during handling. Press it in firmly or use a dab of mounting tape on the back.
- **Label your nodes.** If you are building multiple nodes, put a small sticker or tape label on each board indicating its role (Receiver, Temperature, Pressure). This helps when it is time to flash each board with the correct firmware configuration.

<!-- Suggested image: photo of a completed three-node setup -- receiver, temperature node, and pressure node -- all assembled and ready for firmware flashing. -->

## Next Step

With your hardware assembled, head to the [Firmware Overview](/firmware/overview/) to understand the software that runs on each node.
