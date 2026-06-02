# mcp-l2beat

L2BEAT MCP — Layer 2 ecosystem analytics

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `list_projects` | List all L2BEAT-tracked projects (rollups, validiums, optimiums, sidechains). |
| `get_project` | Full project record by slug — risks, stage, milestones, contracts. |
| `tvs_breakdown` | TVS breakdown by token category and project today. |
| `tvs_history` | Historical TVS time series. |
| `activity` | Daily transaction counts (and UOPS where available). |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
