// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: "Sensor Net",
			logo: {
				light: "./src/assets/sensor-net-logo-light.svg",
				dark: "./src/assets/sensor-net-logo-dark.svg",
				replacesTitle: true,
			},
			social: [
				{
					icon: "github",
					label: "Docs Repository",
					href: "https://github.com/AndrewLemons/sensor-net-docs",
				},
			],
			sidebar: [
				{
					label: "Getting Started",
					items: [
						{ label: "Quick Start", slug: "getting-started/quick-start" },
						{ label: "Overview", slug: "getting-started/overview" },
						{ label: "Parts List", slug: "getting-started/parts-list" },
						{
							label: "Software Prerequisites",
							slug: "getting-started/software-prerequisites",
						},
					],
				},
				{
					label: "Hardware",
					items: [
						{ label: "The Heltec Board", slug: "hardware/heltec-board" },
						{ label: "Sensors", slug: "hardware/sensors" },
						{ label: "Assembly", slug: "hardware/assembly" },
					],
				},
				{
					label: "Firmware",
					items: [
						{ label: "Overview", slug: "firmware/overview" },
						{ label: "Setup", slug: "firmware/setup" },
						{ label: "Configuration", slug: "firmware/configuration" },
						{
							label: "Building and Flashing",
							slug: "firmware/building-and-flashing",
						},
						{ label: "Serial Output", slug: "firmware/serial-output" },
						{ label: "Extending the Firmware", slug: "firmware/extending" },
					],
				},
				{
					label: "Monitor Application",
					items: [
						{ label: "Overview", slug: "monitor/overview" },
						{ label: "Setup", slug: "monitor/setup" },
						{ label: "Running the App", slug: "monitor/running" },
						{ label: "Dashboard Guide", slug: "monitor/dashboard-guide" },
						{ label: "Extending the App", slug: "monitor/extending" },
					],
				},
				{
					label: "Concepts",
					items: [
						{ label: "LoRa Radio", slug: "concepts/lora-radio" },
						{ label: "Mesh Networking", slug: "concepts/mesh-networking" },
						{ label: "Message Format", slug: "concepts/message-format" },
						{ label: "Data Flow", slug: "concepts/data-flow" },
					],
				},
				{
					label: "Reference",
					items: [
						{
							label: "Configuration Reference",
							slug: "reference/configuration",
						},
						{ label: "Pin Map", slug: "reference/pin-map" },
						{ label: "Serial Packet Format", slug: "reference/serial-format" },
						{ label: "Firmware Modules", slug: "reference/firmware-modules" },
						{ label: "Monitor Commands", slug: "reference/monitor-commands" },
						{
							label: "Analytics Thresholds",
							slug: "reference/analytics-thresholds",
						},
						{ label: "Project Structure", slug: "reference/project-structure" },
						{ label: "Glossary", slug: "reference/glossary" },
					],
				},
			],
		}),
	],
});
