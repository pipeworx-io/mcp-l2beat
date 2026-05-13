interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * L2BEAT MCP — Layer 2 ecosystem analytics
 *
 * No auth. Public JSON endpoints; some payloads are large so consumers
 * should paginate / filter as needed.
 *
 * Source: https://l2beat.com/api/
 */


const BASE = 'https://l2beat.com/api';

const tools: McpToolExport['tools'] = [
  {
    name: 'list_projects',
    description: 'List all L2BEAT-tracked projects (rollups, validiums, optimiums, sidechains).',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_project',
    description: 'Full project record by slug — risks, stage, milestones, contracts.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string', description: 'L2BEAT slug (e.g. "arbitrum", "optimism", "base")' } },
      required: ['slug'],
    },
  },
  {
    name: 'tvs_breakdown',
    description: 'TVS breakdown by token category and project today.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Specific project (default: all)' },
      },
    },
  },
  {
    name: 'tvs_history',
    description: 'Historical TVS time series.',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Specific project (default: all projects aggregate)' },
        range: { type: 'string', description: '7d | 30d | 90d | 180d | 1y | max (default 30d)' },
      },
    },
  },
  {
    name: 'activity',
    description: 'Daily transaction counts (and UOPS where available).',
    inputSchema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'Specific project (default: all)' },
        range: { type: 'string', description: '7d | 30d | 90d | 180d | 1y | max (default 30d)' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'list_projects':
      return l2beatGet('/scaling/summary');
    case 'get_project':
      return l2beatGet(`/projects/${encodeURIComponent(reqStr(args, 'slug', '"arbitrum"'))}`);
    case 'tvs_breakdown': {
      const slug = (args.slug as string | undefined)?.trim();
      return slug
        ? l2beatGet(`/scaling/tvs/${encodeURIComponent(slug)}`)
        : l2beatGet('/scaling/tvs');
    }
    case 'tvs_history': {
      const range = String(args.range ?? '30d');
      const slug = (args.slug as string | undefined)?.trim();
      return slug
        ? l2beatGet(`/scaling/tvs/${encodeURIComponent(slug)}?range=${encodeURIComponent(range)}`)
        : l2beatGet(`/scaling/tvs?range=${encodeURIComponent(range)}`);
    }
    case 'activity': {
      const range = String(args.range ?? '30d');
      const slug = (args.slug as string | undefined)?.trim();
      return slug
        ? l2beatGet(`/scaling/activity/${encodeURIComponent(slug)}?range=${encodeURIComponent(range)}`)
        : l2beatGet(`/scaling/activity?range=${encodeURIComponent(range)}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function l2beatGet(path: string) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'pipeworx-mcp-l2beat/1.0 (+https://pipeworx.io)',
    },
  });
  if (res.status === 404) throw new Error(`L2BEAT: not found (${path})`);
  if (res.status === 429) throw new Error('L2BEAT: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`L2BEAT error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
