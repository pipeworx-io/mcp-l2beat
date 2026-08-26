# @pipeworx/l2beat

L2BEAT MCP — Layer 2 ecosystem data: TVL (now "TVS" — total value secured), activity, risk assessments, stage. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

- `list_projects(limit?, include_archived?, category?, include_chart?)` — every L2 / sidechain /
  validium tracked, **ranked by Total Value Secured (USD), largest first**. Answers "which L2
  secures the most value". Returns `rank`, name, slug, category, layer type, host chain, stage,
  `tvs_usd`, `tvs_change_7d` and the native/canonical/external/ether/stablecoin/btc split.
  `limit` defaults to 25 (max 200); archived projects are excluded unless `include_archived` is
  true. The upstream 124-point ecosystem TVS chart is omitted unless `include_chart` is true —
  it is ~30x the size of the project rows and buries the ranking.
- `get_project(slug)` — full project page data
- `tvs_breakdown(slug?)` — TVS by token / type, today
- `tvs_history(slug?, range?)` — historical TVS
- `activity(slug?, range?)` — daily transaction counts + UOPS

## Data source

`https://l2beat.com/api/` — public JSON.

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "l2beat": {
      "url": "https://gateway.pipeworx.io/l2beat/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/l2beat/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about L2beat data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
