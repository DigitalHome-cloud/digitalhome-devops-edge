# ADR-0002: digitalhome-devops-edge — run and maintenance, not design

**Status:** accepted · **Date:** 2026-11-15

## Context

The repository was called `digitalhome-edge`, which said where it runs and not
what it is for. A second kind of edge is coming: `digitalhome-pro-edge`, a design
tool for installers where Claude edits a home's A-Box. Two repositories called
"edge" need names that tell them apart.

## Decision

1. The repository is renamed **digitalhome-devops-edge**, on GitHub and locally.
   GitHub redirects the old URL.
2. Its scope is **running and maintaining** a home: the devices (Node-RED owns
   them, unchanged), the phones' MQTT clients, the door station, pairing with
   the cloud, health, updates and backups. Over time it becomes the controller
   of every digitalhome.cloud instance in the home — the pro edge and the
   Mediathek edge included: their health, version and updates.
3. **What keeps its name**, because it identifies a running system rather than
   the repository: the hostname `digitalhome-edge` and its `/etc/hosts` block,
   the OAuth `client_id` the cloud has registered, the MCP `serverName` clients
   have configured, `/opt/dhe`, and the flows submodule
   `digitalhome-edge-nodered-flows`.
4. Design moves to the pro edge. This repository never edits a design.

## Consequences

- `bin/dhcedge` looks for the checkout under the new name first and the old one
  second, so the production box works before and after its clone is moved.
- Clones made before the rename keep working through GitHub's redirect; moving
  them is tidy-up, not a fix. `git remote set-url origin
  https://github.com/DigitalHome-cloud/digitalhome-devops-edge.git` once.
- Renaming the OAuth client id or the MCP server name would be a migration on
  the cloud and every client; it is deliberately not done.
- The fleet features (health and updates of the other edges) are not built yet.
  This ADR records the scope so that they land here and not in each edge.
