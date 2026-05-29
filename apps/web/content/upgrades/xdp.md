# XDP: High-Performance Networking for Solana Validators

**May 29 2026** • Solana Foundation

XDP (eXpress Data Path) is a high-performance networking technology from the
Linux kernel that allows Solana validators to process network packets
significantly faster. By bypassing normal kernel network processing, data flows
more directly between the network card and validator software — reducing packet
processing latency by up to 200x compared to standard networking.

Agave 4.0.0 and later supports XDP for block propagation. Agave validator
clients must explicitly enable the feature. The Firedancer client uses XDP by
default.

|                  |                                                      |
| ---------------- | ---------------------------------------------------- |
| Status           | 🟢 Available in Agave 4.0.0+, All Firedancer clients |
| Protocol Change? | No                                                   |
| Breaking Change? | No                                                   |
| Action Required? | Yes (for Agave validators)                           |

---

## What is XDP?

The Linux kernel's normal networking stack is designed for flexibility and
generality. The kernel's networking logic adds overhead that does not impact
most applications significantly, but high performance applications, like Solana,
can be constrained by the kernel code.

XDP hooks into the kernel at the earliest possible point, before the packet
reaches the network stack. XDP allows programs to make routing decisions in
nanoseconds. For Solana validators, this means blocks are shared with the
network faster, propagate faster, and the validator can respond faster.

Think of XDP as a shortcut that bypasses many layers of normal network
processing. The tradeoff is that it requires specific kernel support and
compatible network hardware. Solana validator operators are accustomed to high
performance computing and are already adopting the new feature.

## Impact on Block Propagation

Testing has shown that XDP is a key enabler for consistently producing 100M
compute unit blocks. When enough top validators on the network adopt XDP, block
propagation becomes very fast. The network will easily be able to handle larger
block sizes.

While XDP is not a protocol change and does not require a network upgrade,
widespread validator adoption is critical. The 100M CU feature cannot be
activated until engineers see the block propagation improvements in the network.

## Agave: How to Enable XDP

XDP is supported in Agave 4.0.0+ but must be enabled by the validator operator.
Follow the official Anza setup guide to configure your system:

[**Agave XDP Setup Guide →**](https://www.anza.xyz/blog/agave-xdp-setup-guide)

The guide covers:

- Compatible Linux kernel versions and network hardware
- Kernel configuration requirements
- Agave startup flags to enable XDP
- How to verify XDP is active on your validator

Future releases of Agave will turn XDP on by default.

## Firedancer: Enabled by Default

The Firedancer validator client has used XDP since its inception. XDP is the
default networking mode. Firedancer was designed from the ground up to take
advantage of kernel-bypass networking.

If you are running Firedancer, no action is needed. XDP is already active.

## Why This Matters

The Solana protocol is rapidly pushing the boundaries of bandwidth and
performance. The current Solana block size limit is 60M CUs. At current block
sizes, the block propagation layer of the protocol is not constrained. The
Solana protocol is quickly moving to enable 100M CU blocks, a 66% increase in
block capacity.

At 100M CUs, Turbine, the block propagation layer of the protocol, will become
the network bottleneck. Larger blocks mean more data is being sent to thousands
of machines every second. The bandwidth usage will require a large speed up in
networking performance. XDP is the key improvement that will enable Solana to
easily handle 100M CU blocks. Larger block capacity will enable real work use
cases like trading and payments.

---

## Summary

XDP is a linux kernel networking technology. Solana validator clients will
leverage XDP to enable much higher performance networking and allow for a 66%
increase in block capacity.

| Client       | XDP Status         | Action Required               |
| ------------ | ------------------ | ----------------------------- |
| Agave 4.0.0+ | Supported, opt-in  | Enable via config (see guide) |
| Firedancer   | Enabled by default | None                          |

**Learn more:** [Solana Upgrades](/upgrades)
