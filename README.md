# digitalhome-devops-edge

The run-and-maintenance edge of a digitalhome.cloud home: the box that owns the
devices (Node-RED and Mosquitto), pairs the home with the cloud, and keeps the
home's other digitalhome.cloud instances healthy and up to date.

Formerly `digitalhome-edge`. The hostname `digitalhome-edge`, the OAuth client
id, the MCP server name and `/opt/dhe` kept their names: they identify a running
system, not this repository. See [ADR-0002](docs/adr/0002-devops-edge.md).

- What runs today: [`SPEC.md`](SPEC.md)
- Installing a box: [`docs/install.md`](docs/install.md)
- Guidance for Claude Code: [`CLAUDE.md`](CLAUDE.md)

Designing a home is not done here: that is
[digitalhome-pro-edge](https://github.com/DigitalHome-cloud/digitalhome-pro-edge).
