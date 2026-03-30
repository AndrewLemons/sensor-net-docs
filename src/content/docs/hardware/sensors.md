---
title: Sensors
description: Details about the TMP102 temperature sensor and BMP280 pressure sensor used in Sensor Net.
---

Sensor Net uses two external sensor breakout boards: the **TMP102** for temperature and the **BMP280** for atmospheric pressure. Both communicate with the microcontroller over the I2C bus. This page describes each sensor and how the firmware reads data from it.

## TMP102 Temperature Sensor

The TMP102 is a 12-bit digital temperature sensor manufactured by Texas Instruments. It is commonly available as a small breakout board from SparkFun and other vendors.

![TMP102](../../../assets/tmp102.png)

### Key Specifications

| Property            | Value                                 |
| ------------------- | ------------------------------------- |
| Manufacturer        | Texas Instruments                     |
| Interface           | I2C                                   |
| Default I2C address | 0x48 (with ADD0 pin connected to GND) |
| Resolution          | 0.0625 degrees C (12-bit)             |
| Accuracy            | +/- 0.5 degrees C (typical)           |
| Range               | -40 degrees C to +125 degrees C       |
| Supply voltage      | 1.4V to 3.6V                          |

### How the Firmware Reads It

The firmware's `TMP102Sensor` driver reads the temperature register directly over I2C:

1. Write `0x00` to the sensor to select the temperature register.
2. Read 2 bytes back (MSB first, then LSB).
3. Combine the upper 12 bits of the 16-bit word to get the raw value.
4. Multiply the raw value by 0.0625 to get the temperature in degrees Celsius.

**Example calculation:**

```
MSB = 0x17, LSB = 0x80
raw = (0x17 << 4) | (0x80 >> 4) = 0x178 = 376
temperature = 376 x 0.0625 = 23.5 degrees C
```

### Alternate I2C Address

If you connect the ADD0 pin to VCC instead of GND, the I2C address changes to **0x49**. This is useful if you want to attach two TMP102 sensors to the same bus. Update the `TMP102_ADDRESS` constant in `config.h` to match.

## BMP280 Pressure Sensor

The BMP280 is a digital barometric pressure sensor manufactured by Bosch. It is widely available as a breakout board from Adafruit, SparkFun, and many generic vendors.

![BMP280](../../../assets/bmp280.png)

### Key Specifications

| Property            | Value                                            |
| ------------------- | ------------------------------------------------ |
| Manufacturer        | Bosch Sensortec                                  |
| Interface           | I2C (also supports SPI, but Sensor Net uses I2C) |
| Default I2C address | 0x76 (with SDO pin connected to GND)             |
| Pressure range      | 300 to 1100 hPa                                  |
| Pressure resolution | 0.16 Pa                                          |
| Accuracy            | +/- 1 hPa (typical)                              |
| Supply voltage      | 1.71V to 3.6V                                    |

### How the Firmware Reads It

The firmware's `BMP280Sensor` driver uses the **Adafruit BMP280 library**, which handles all the internal compensation calculations that the BMP280 requires. The library's `readPressure()` method returns pressure in Pascals, so the driver divides by 100 to convert to hectopascals (hPa), which is the standard meteorological unit.

```
1 hPa = 100 Pa
Standard atmosphere = 1013.25 hPa
```

### Alternate I2C Address

If you connect the SDO pin to VCC instead of GND, the I2C address changes to **0x77**. Update the `BMP280_ADDRESS` constant in `config.h` to match.

## Sensor Driver Interface

Both sensor drivers implement a common abstract interface defined in the firmware. This means the main firmware code does not need to know which specific sensor is attached -- it simply calls `sensor.read()` and gets a value back.

```cpp
class Sensor {
public:
    virtual bool          begin() = 0;  // Initialize hardware
    virtual SensorReading read()  = 0;  // Take one reading
    virtual const char   *name()  = 0;  // e.g. "TMP102"
    virtual const char   *unit()  = 0;  // e.g. "C"
};
```

The `NODE_TYPE` setting in `config.h` determines which concrete sensor class is compiled into the firmware for a given build. See the [Configuration](/firmware/configuration/) page for details.

## Next Step

Now that you understand the sensors, proceed to [Assembly](/hardware/assembly/) for step-by-step wiring instructions.
