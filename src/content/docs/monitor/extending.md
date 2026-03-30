---
title: Extending the App
description: How to modify the monitor application's frontend, backend, and analytics.
---

The monitor application is designed with clear separation between layers, making it straightforward to modify. This page covers the most common extension points.

## Modifying the Frontend

### Adding a New Dashboard Component

All dashboard components live in `src/components/`. Each component receives data as props and is responsible only for rendering. To add a new visualization:

1. Create a new component file in `src/components/`, for example `SignalHistory.tsx`.
2. Accept the relevant data as props (node summaries, sensor data, etc.).
3. Import and render the component in `App.tsx`, passing the data from the hooks.

The existing components follow a simple pattern: they receive data from `App.tsx` and render it. No component fetches its own data or mutates shared state.

### Modifying the Analytics

The analytics functions in `src/analytics/` are pure functions with no side effects. They take data arrays as input and return computed results. To modify how trends, anomalies, or health scores are calculated:

- **Trend detection** -- Edit `src/analytics/trends.ts`. This computes rising, falling, or stable trends and rates of change from an array of timestamped values.
- **Anomaly detection** -- Edit `src/analytics/insights.ts`. This checks each sensor against thresholds to flag conditions like overheating.
- **Node health** -- Edit `src/analytics/node-health.ts`. This scores each node based on RSSI, SNR, staleness, and online/offline status.
- **System status** -- Edit `src/analytics/system-status.ts`. This aggregates insights and node health into an overall system status level.

All analytics functions are invoked in `App.tsx` inside `useMemo` hooks, so they automatically re-run when their input data changes.

### Adjusting Alert Thresholds

If you want to change when alerts are triggered (for example, raising the overheat temperature or extending the offline timeout), edit `src/analytics/thresholds.ts`. See the [Analytics Thresholds Reference](/reference/analytics-thresholds/) for the full list of constants.

## Modifying the Backend

### Adding a New Tauri Command

All backend logic lives in `src-tauri/src/lib.rs`. To expose a new function to the frontend:

1. Write a Rust function with the `#[tauri::command]` attribute in `lib.rs`.
2. Register the command in the Tauri builder's `invoke_handler()` call.
3. Call it from the frontend using `invoke("your_command_name", { ... })`.

For example, to add a command that returns the database file path:

```rust
#[tauri::command]
fn get_db_path(app: tauri::AppHandle) -> String {
    // Return the path to the SQLite database
}
```

Then register it alongside the existing commands in the builder setup.

### Modifying the Serial Parser

The serial parser uses a regex to extract fields from `[REPORT]` lines. If you change the serial output format in the firmware (for example, adding a new field), you need to update the regex in `lib.rs` to match.

The current format is:

```
[REPORT] node=A1B2 type=temperature value=23.45 unit=C rssi=-67 snr=8.5 uptime=3600 tx=42 hops=1
```

If you add a field like `humidity=65.3`, update the regex to capture it and add the corresponding column to the SQLite `reports` table.

### Modifying the Database Schema

The database has a single `reports` table with columns for every field in the serial report format. To add a new column:

1. Add the column to the `CREATE TABLE` statement in `lib.rs`.
2. Update the `INSERT INTO` statement to include the new column.
3. Update any `SELECT` queries that need to return the new field.
4. Update the corresponding TypeScript type in `src/types.ts` so the frontend can use the new data.

:::caution
If you change the database schema, existing `data.db` files from previous sessions will not have the new column. Delete the old database file to let the app create a fresh one with the new schema, or use an `ALTER TABLE` migration.
:::

## Supporting a New Sensor Type

If you added a new sensor type in the firmware (see [Extending the Firmware](/firmware/extending/)), the monitor application will receive reports with the new type string automatically, as long as the serial output format remains the same. The data will be stored in the database with the new `sensor_type` value.

To display the new sensor type on the dashboard:

1. **Add chart support** -- If you want a dedicated chart, create a new data query in `useMonitorData` that filters by the new sensor type, similar to how temperature and pressure data are queried.
2. **Add insight support** -- Extend `computeSensorInsights` in `src/analytics/insights.ts` to process the new sensor type and flag relevant anomalies.
3. **Add UI** -- Add a new chart component or integrate the data into existing components.

## Development Tips

- **Frontend changes are instant.** In `tauri dev` mode, editing any file in `src/` triggers hot reload. You see changes immediately without restarting.
- **Backend changes cause a restart.** Editing files in `src-tauri/src/` triggers a Rust recompilation. The app restarts after the compile finishes.
- **Use frontend-only mode for styling.** Run `bun run dev` to iterate on layout without waiting for Rust compilation. Serial and database features will not work, but the UI renders.
- **Check the browser console.** In development mode, open the browser dev tools inside the Tauri window (right-click, Inspect Element) to see console logs, network requests to Rust commands, and React rendering information.
