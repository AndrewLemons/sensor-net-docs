---
title: Mesh Networking
description: How the Sensor Net flooding mesh works, including relay logic, deduplication, and hop limits.
---

Sensor Net implements a **flooding mesh** network. This is the simplest type of mesh -- when a node receives a packet it has not seen before, it retransmits (floods) it. This page explains why a mesh is useful, how packets travel through it, and how the system prevents infinite loops.

## Why a Mesh?

LoRa has impressive range, but walls, terrain, and distance still limit it. In a **mesh network**, every node acts as both an endpoint and a relay. A packet originating from node A can reach node C even if A and C cannot hear each other directly, as long as node B is within range of both.

This means you can extend coverage by simply adding more nodes. No centralized router is required.

## How a Packet Travels

Here is the lifecycle of a single packet as it moves through the mesh:

**Step 1: Origin.** A sensor node takes a reading and creates a packet. The packet gets a unique `msg_id` (computed as `node_id XOR sequence_counter`) and starts with `hops = 0`.

**Step 2: First receive.** Another sensor node (Node B) receives the packet. Node B checks two things:

- Has it seen this `msg_id` before? (No -- this is a new packet.)
- Is `hops` less than `MESH_MAX_HOPS`? (Yes -- 0 is less than 3.)

Since both checks pass, Node B marks the `msg_id` as seen, increments `hops` to 1, and schedules a relay transmission after a random delay.

**Step 3: Relay.** After the jitter delay elapses, Node B transmits the packet with `hops = 1`.

**Step 4: Further propagation.** Any other node (including the receiver) that hears the relay performs the same checks. Nodes that have not seen the packet before may relay it again (with `hops = 2`). The receiver node decodes and logs the report but does not relay.

This process continues until either all reachable nodes have seen the packet or the hop limit is reached.

## Duplicate Prevention

Without deduplication, a packet would flood the network forever. Every node maintains a **ring buffer** of the last 32 message IDs it has seen.

When a packet arrives, the node calls `hasSeen(msg_id)`, which searches the ring buffer. If the ID is found, the packet is silently dropped. If the ID is new, it is added to the buffer before relaying.

A node also marks its **own transmissions** as seen immediately. This prevents the node from relaying its own packet if it hears it echoed back by another node.

### Ring Buffer Details

The seen-message table is a fixed-size array of 32 slots:

```cpp
uint32_t _seen[32];   // Ring buffer of recent msg_ids
uint8_t  _head;       // Write position
uint8_t  _count;      // Number of valid entries
```

New entries are written at `_head`, which advances modulo 32. When the buffer is full, the oldest entry is silently overwritten. The `hasSeen()` check does a linear search through all valid entries -- at most 32 comparisons, which is trivial on a 240 MHz processor.

The ring buffer size (`MESH_SEEN_TABLE_SIZE = 32`) is a trade-off: larger means better deduplication over time but uses more RAM. For a small network, 32 is more than sufficient.

## Hop Limit (TTL)

Each packet carries a `hops` field that is incremented by every relay. When `hops` reaches `MESH_MAX_HOPS` (default: 3), the packet is dropped instead of relayed. This acts as a **Time-To-Live (TTL)** and ensures the network cannot get stuck in an infinite relay loop, even if deduplication somehow fails.

For a small network in a single building, 3 hops is generous. For a larger deployment, you can increase `MESH_MAX_HOPS` in `config.h`.

## Relay Jitter

If two nodes receive the same packet at the same time and both relay it instantly, their transmissions overlap and corrupt each other. To prevent this, each node waits a **random delay** between 0 and `MESH_RELAY_JITTER_MS` (default: 200 ms) before transmitting a relay.

This randomized delay spreads the relay transmissions out in time, greatly reducing the chance of collisions. The jitter is implemented as a non-blocking timer -- the firmware records the scheduled transmit time and checks it on each iteration of `loop()`, so no `delay()` call blocks the processor.

The pending relay is stored in a `PendingRelay` struct in `main.cpp`:

```cpp
struct PendingRelay {
    uint8_t  data[256];   // The packet data to relay
    uint8_t  length;      // Packet length
    uint32_t sendAt;      // millis() time to transmit
    bool     pending;     // Whether a relay is scheduled
};
```

## Why the Receiver Does Not Relay

The receiver node never relays packets. If it retransmitted, the radio would switch to transmit mode for the duration of the transmission. During that time, any incoming packets from other nodes would be missed. Since the receiver's primary job is to capture every packet, it stays in receive mode permanently.

## Flooding vs. Routing

Sensor Net uses a **flooding** strategy rather than a true routing protocol. In a routing protocol, each node maintains a table of routes to other nodes and forwards packets along specific paths. Flooding is simpler: every node broadcasts everything. The trade-off is:

| Aspect        | Flooding                         | Routing                                |
| ------------- | -------------------------------- | -------------------------------------- |
| Complexity    | Very simple                      | Complex (route discovery, maintenance) |
| Reliability   | High (multiple paths)            | Depends on route health                |
| Airtime usage | Higher (redundant transmissions) | Lower (targeted forwarding)            |
| Code size     | Small                            | Large                                  |

For a network with a handful of nodes, flooding is an excellent choice. It is easy to understand, easy to debug, and reliable. For networks with dozens or hundreds of nodes, the redundant airtime becomes a problem and a routing protocol would be more appropriate.
