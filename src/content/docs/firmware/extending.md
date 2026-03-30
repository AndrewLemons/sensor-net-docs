---
title: Extending the Firmware
description: How to add new sensor types, modify radio parameters, and extend the Sensor Net firmware.
---

The Sensor Net firmware is designed to be extended. This page covers the most common modifications: adding a new sensor type, increasing network range, and building a decoder for another platform.

## Adding a New Sensor Type

Suppose you want to add a humidity sensor (for example, an SHT31 or DHT22). Here is the complete process:

### Step 1: Update the Protobuf Definition

Add the new sensor type to the enum in `proto/messages.proto`:

```protobuf
enum SensorType {
    SENSOR_UNKNOWN     = 0;
    SENSOR_TEMPERATURE = 1;
    SENSOR_PRESSURE    = 2;
    SENSOR_HUMIDITY    = 3;  // New
}
```

### Step 2: Regenerate the C Bindings

Run the protobuf code generator to update the C structs:

```sh
pip install nanopb
./scripts/generate_proto.sh
```

The updated files are placed in `firmware/node/lib/proto/`.

### Step 3: Create a Sensor Driver

Create a new directory `firmware/node/lib/Sensor/` (if it does not already contain your new files) and implement the `Sensor` interface:

```cpp
// HumiditySensor.h
#pragma once
#include "Sensor.h"

class HumiditySensor : public Sensor {
public:
    bool          begin() override;
    SensorReading read()  override;
    const char   *name()  override { return "SHT31"; }
    const char   *unit()  override { return "%RH"; }
};
```

```cpp
// HumiditySensor.cpp
#include "HumiditySensor.h"
#include <Wire.h>

bool HumiditySensor::begin() {
    // Initialize the sensor over I2C
    // Return true if successful, false if the sensor is not detected
}

SensorReading HumiditySensor::read() {
    // Read from the sensor and return a SensorReading
    // with the value and sensor_type set appropriately
}
```

The exact implementation depends on your sensor's I2C protocol. Consult the sensor's datasheet or use an existing Arduino library.

### Step 4: Add a Node Type Constant

In `config.h`, add a new constant:

```c
#define NODE_HUMIDITY  3
```

### Step 5: Wire It Into main.cpp

In `main.cpp`, add a conditional block for the new node type:

```cpp
#elif NODE_TYPE == NODE_HUMIDITY
#include "HumiditySensor.h"
HumiditySensor sensor;
```

This follows the same pattern used by the existing temperature and pressure node types.

### Step 6: Update the Receiver

In the receiver's `pollReceive()` function in `main.cpp`, update the switch statement or if/else chain that maps `sensor_type` values to string labels, so the serial output prints the correct type name for your new sensor.

### Step 7: Build and Test

Set `NODE_TYPE` to `NODE_HUMIDITY` in `config.h`, build, and flash:

```sh
pio run -t upload
```

Open the serial monitor and verify that the node reads the sensor and transmits reports.

## Increasing Network Range

If you need more range (for example, across a campus or between buildings), adjust two radio parameters in `config.h`:

```c
#define LORA_SPREADING_FACTOR  10   // Was 7
#define LORA_BANDWIDTH         125.0 // Was 500.0
```

Higher spreading factor and narrower bandwidth trade data rate for range. At SF10 / 125 kHz, each packet takes roughly 8 times longer to transmit, but the signal can travel significantly further and penetrate more obstacles.

**Important:** All nodes must use the same spreading factor and bandwidth. If you change these on one node, you must change them on every node and reflash.

You can also increase `MESH_MAX_HOPS` in `config.h` to allow packets to traverse more intermediate relay nodes:

```c
#define MESH_MAX_HOPS  5  // Was 3
```

## Adjusting the Transmission Interval

To send readings more or less frequently, change `REPORT_INTERVAL_MS`:

```c
#define REPORT_INTERVAL_MS  10000  // 10 seconds instead of 5
```

Longer intervals reduce radio congestion, which is important in larger networks. Shorter intervals give more responsive data at the cost of more airtime.

## Building a PC-Side Decoder

Because Sensor Net uses Protocol Buffers, you can generate decoders in other languages from the same `.proto` file. For example, to build a Python decoder:

```sh
pip install grpcio-tools
python -m grpc_tools.protoc -I proto --python_out=. proto/messages.proto
```

This generates a Python module with classes for `SensorReport` and `SensorType`. You can then read raw bytes from the serial port and decode them directly, bypassing the text-based `[REPORT]` format.

## Adding a Library Dependency

If your new sensor requires an Arduino library (for example, an Adafruit driver), add it to `platformio.ini`:

```ini
lib_deps =
    RadioLib@^6.4
    U8g2@^2.35
    Nanopb@^0.4
    adafruit/Adafruit BMP280 Library@^2.6
    adafruit/Adafruit SHT31 Library@^2.0  ; New
```

PlatformIO downloads the library automatically on the next build.
