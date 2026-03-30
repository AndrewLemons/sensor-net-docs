---
title: Software Prerequisites
description: All the software tools you need to install before building Sensor Net.
---

Before you can build the firmware or run the monitor application, you need to install several software tools. This page covers everything for both parts of the project. Install them in the order listed.

## For the Firmware

### PlatformIO

PlatformIO manages compilers, board support packages, and library dependencies for the ESP32 firmware. You can install it in one of two ways:

**Option A: VS Code Extension (recommended)**

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open the Extensions panel (click the square icon in the sidebar or press `Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Search for "PlatformIO IDE" and click **Install**.
4. Restart VS Code when prompted.

![PlatformIO Extension Page](../../../assets/platformio.png)

**Option B: Command-line installation**

```sh
pip install platformio
```

Verify the installation:

```sh
pio --version
```

### Git

You need Git to clone the firmware repository. It is likely already installed on your system. Check with:

```sh
git --version
```

If not installed:

- **macOS:** `xcode-select --install`
- **Windows:** Download from [git-scm.com](https://git-scm.com/)
- **Linux:** `sudo apt install git` (Debian/Ubuntu) or `sudo dnf install git` (Fedora)

## For the Monitor Application

The monitor application has its own set of prerequisites. If you only want to build and run the firmware, you can skip this section and come back later.

### Rust

Rust is the programming language used for the monitor's backend. Install it with the official installer:

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

After installation, restart your terminal and verify:

```sh
rustc --version
```

On Windows, download and run the installer from [rustup.rs](https://rustup.rs/).

### Bun

Bun is a JavaScript runtime and package manager used for the monitor's frontend. It is similar to Node.js and npm but faster. Install it with:

```sh
curl -fsSL https://bun.sh/install | bash
```

Verify the installation:

```sh
bun --version
```

On Windows, use:

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

### Tauri System Dependencies

Tauri requires platform-specific system libraries to build native desktop applications.

**macOS:**

```sh
xcode-select --install
```

**Linux (Debian/Ubuntu):**

```sh
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

**Windows:**

Install the [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and ensure the "Desktop development with C++" workload is selected.

For detailed platform-specific instructions, refer to the [official Tauri prerequisites guide](https://tauri.app/start/prerequisites/).

## Summary

Here is a quick checklist of what you need installed:

| Tool                                | Needed For  | Verify With         |
| ----------------------------------- | ----------- | ------------------- |
| VS Code + PlatformIO (or `pio` CLI) | Firmware    | `pio --version`     |
| Git                                 | Both        | `git --version`     |
| Rust (`rustc`, `cargo`)             | Monitor app | `rustc --version`   |
| Bun                                 | Monitor app | `bun --version`     |
| Tauri system dependencies           | Monitor app | (platform-specific) |

## Next Step

With your tools installed, move on to the [Hardware](/hardware/heltec-board/) section to learn about the development board and sensors before assembling your nodes.
