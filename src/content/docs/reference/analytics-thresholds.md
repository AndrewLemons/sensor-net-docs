---
title: Analytics Thresholds
description: Tunable constants used by the monitor application's analytics layer.
---

The monitor application uses several numeric thresholds to determine when to raise alerts and warnings. These constants are defined in `src/analytics/thresholds.ts` and can be adjusted without modifying any other file.

## Threshold Constants

| Constant                      | Default Value | Description                                                                                                  |
| ----------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------ |
| `TEMP_OVERHEAT_C`             | `40`          | Temperature in degrees Celsius above which a node is flagged as overheating.                                 |
| `TEMP_RAPID_CHANGE_PER_MIN`   | `2.0`         | Rate of temperature change in degrees Celsius per minute that triggers a rapid-change warning.               |
| `PRESSURE_RAPID_DROP_PER_MIN` | `0.5`         | Rate of pressure drop in hPa per minute that triggers an alert.                                              |
| `NODE_OFFLINE_SECONDS`        | `60`          | Seconds since the last received packet before a node is considered offline.                                  |
| `NODE_STALE_SECONDS`          | `30`          | Seconds since the last received packet before a node is considered stale (still online, but slow to report). |
| `MIN_POINTS_FOR_TREND`        | `3`           | Minimum number of data points required before a trend (rising, falling, stable) is computed.                 |

## How Thresholds Are Used

### Temperature Alerts

The `computeSensorInsights()` function checks each temperature node's current reading and rate of change:

- If the latest temperature exceeds `TEMP_OVERHEAT_C`, an **overheating** anomaly flag is raised.
- If the rate of temperature change exceeds `TEMP_RAPID_CHANGE_PER_MIN`, a **rapid change** warning is raised.

### Pressure Alerts

- If the rate of pressure decrease exceeds `PRESSURE_RAPID_DROP_PER_MIN`, a **rapid pressure drop** alert is raised. Rapid pressure drops can indicate approaching severe weather.

### Node Health

The `computeNodeHealth()` function uses the time thresholds:

- If a node has not been heard for longer than `NODE_STALE_SECONDS`, it is marked as **stale** (amber warning).
- If a node has not been heard for longer than `NODE_OFFLINE_SECONDS`, it is marked as **offline** (red alert).

### Trend Detection

The `computeSensorInsights()` function will not compute trend direction or rate of change until at least `MIN_POINTS_FOR_TREND` data points are available for a given sensor. This prevents misleading trends from insufficient data.

## Modifying Thresholds

To change a threshold, edit `src/analytics/thresholds.ts`:

```typescript
// Example: raise the overheat threshold to 50 degrees C
export const TEMP_OVERHEAT_C = 50;

// Example: require more data points before showing trends
export const MIN_POINTS_FOR_TREND = 5;
```

Changes take effect immediately in development mode (via hot reload) or after the next build.
