# @pipeworx/l2beat

L2BEAT MCP — Layer 2 ecosystem data: TVL (now "TVS" — total value secured), activity, risk assessments, stage. No auth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about L2beat data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
