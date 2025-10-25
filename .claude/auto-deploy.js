#!/usr/bin/env node

/**
 * Render MCP Server
 * Provides tools for Claude to interact with Render API
 * - Check deployment status
 * - Fetch deployment logs
 * - Trigger new deployments
 * - Read environment variables
 */

const https = require('https');

const RENDER_API_KEY = process.env.RENDER_API_KEY;
const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID;
const RENDER_API_BASE = 'https://api.render.com/v1';

if (!RENDER_API_KEY || !RENDER_SERVICE_ID) {
  console.error('Error: RENDER_API_KEY and RENDER_SERVICE_ID must be set');
  process.exit(1);
}

/**
 * Make authenticated request to Render API
 */
function renderRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, RENDER_API_BASE);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsed.message || data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * MCP Server Implementation
 */
const server = {
  name: 'render',
  version: '1.0.0',

  async initialize() {
    return {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: this.name,
        version: this.version
      }
    };
  },

  async listTools() {
    return {
      tools: [
        {
          name: 'check_deploy_status',
          description: 'Check the current deployment status of the Render service',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        },
        {
          name: 'fetch_deploy_logs',
          description: 'Fetch the latest deployment logs from Render',
          inputSchema: {
            type: 'object',
            properties: {
              limit: {
                type: 'number',
                description: 'Number of log entries to fetch (default: 100)',
                default: 100
              }
            },
            required: []
          }
        },
        {
          name: 'trigger_deploy',
          description: 'Trigger a new deployment on Render',
          inputSchema: {
            type: 'object',
            properties: {
              clearCache: {
                type: 'boolean',
                description: 'Whether to clear build cache',
                default: false
              }
            },
            required: []
          }
        },
        {
          name: 'get_service_info',
          description: 'Get detailed information about the Render service including env vars',
          inputSchema: {
            type: 'object',
            properties: {},
            required: []
          }
        }
      ]
    };
  },

  async callTool(name, args) {
    try {
      switch (name) {
        case 'check_deploy_status':
          return await this.checkDeployStatus();

        case 'fetch_deploy_logs':
          return await this.fetchDeployLogs(args.limit || 100);

        case 'trigger_deploy':
          return await this.triggerDeploy(args.clearCache || false);

        case 'get_service_info':
          return await this.getServiceInfo();

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  },

  async checkDeployStatus() {
    const deploys = await renderRequest(`/services/${RENDER_SERVICE_ID}/deploys?limit=5`);

    const latest = deploys[0];
    const status = {
      id: latest.id,
      status: latest.status,
      createdAt: latest.createdAt,
      finishedAt: latest.finishedAt,
      commitId: latest.commit?.id,
      commitMessage: latest.commit?.message
    };

    let text = `=€ **Latest Deployment Status**\n\n`;
    text += `- **Status**: ${status.status}\n`;
    text += `- **Deploy ID**: ${status.id}\n`;
    text += `- **Started**: ${new Date(status.createdAt).toLocaleString()}\n`;

    if (status.finishedAt) {
      text += `- **Finished**: ${new Date(status.finishedAt).toLocaleString()}\n`;
    }

    if (status.commitId) {
      text += `- **Commit**: ${status.commitId.substring(0, 7)}\n`;
      text += `- **Message**: ${status.commitMessage}\n`;
    }

    text += `\n**Recent Deployments:**\n`;
    deploys.slice(0, 5).forEach((deploy, i) => {
      const icon = deploy.status === 'live' ? '' :
                   deploy.status === 'build_failed' ? 'L' :
                   deploy.status === 'build_in_progress' ? '=' : 'ø';
      text += `${i + 1}. ${icon} ${deploy.status} - ${new Date(deploy.createdAt).toLocaleString()}\n`;
    });

    return {
      content: [{
        type: 'text',
        text: text
      }]
    };
  },

  async fetchDeployLogs(limit) {
    const deploys = await renderRequest(`/services/${RENDER_SERVICE_ID}/deploys?limit=1`);
    const latestDeploy = deploys[0];

    // Get deploy logs
    const logsUrl = `/services/${RENDER_SERVICE_ID}/deploys/${latestDeploy.id}/logs`;
    const logs = await renderRequest(logsUrl);

    let text = `=Ë **Deployment Logs** (Deploy: ${latestDeploy.id})\n\n`;
    text += `Status: ${latestDeploy.status}\n\n`;
    text += `\`\`\`\n`;

    // Render API returns logs as an array or string
    if (Array.isArray(logs)) {
      text += logs.slice(-limit).map(log => log.message || log).join('\n');
    } else if (typeof logs === 'string') {
      const lines = logs.split('\n');
      text += lines.slice(-limit).join('\n');
    } else {
      text += JSON.stringify(logs, null, 2);
    }

    text += `\n\`\`\``;

    return {
      content: [{
        type: 'text',
        text: text
      }]
    };
  },

  async triggerDeploy(clearCache) {
    const result = await renderRequest(`/services/${RENDER_SERVICE_ID}/deploys`, 'POST', {
      clearCache: clearCache
    });

    let text = `=€ **New Deployment Triggered**\n\n`;
    text += `- **Deploy ID**: ${result.id}\n`;
    text += `- **Status**: ${result.status}\n`;
    text += `- **Clear Cache**: ${clearCache ? 'Yes' : 'No'}\n`;
    text += `- **Started**: ${new Date(result.createdAt).toLocaleString()}\n`;

    return {
      content: [{
        type: 'text',
        text: text
      }]
    };
  },

  async getServiceInfo() {
    const service = await renderRequest(`/services/${RENDER_SERVICE_ID}`);
    const envVars = await renderRequest(`/services/${RENDER_SERVICE_ID}/env-vars`);

    let text = `9 **Service Information**\n\n`;
    text += `- **Name**: ${service.name}\n`;
    text += `- **Type**: ${service.type}\n`;
    text += `- **Region**: ${service.serviceDetails?.region || 'N/A'}\n`;
    text += `- **Plan**: ${service.serviceDetails?.plan || 'N/A'}\n`;
    text += `- **Branch**: ${service.serviceDetails?.autoDeploy?.branch || 'N/A'}\n`;
    text += `- **Root Dir**: ${service.serviceDetails?.rootDir || '/'}\n`;
    text += `- **Build Command**: ${service.serviceDetails?.buildCommand || 'N/A'}\n`;
    text += `- **Start Command**: ${service.serviceDetails?.startCommand || 'N/A'}\n`;

    text += `\n**Environment Variables** (${envVars.length} total):\n`;
    envVars.forEach(env => {
      // Don't expose actual values
      text += `- ${env.key}: ${env.value ? '[SET]' : '[EMPTY]'}\n`;
    });

    return {
      content: [{
        type: 'text',
        text: text
      }]
    };
  }
};

/**
 * MCP Protocol Handler
 */
async function handleMessage(message) {
  const { method, params, id } = message;

  try {
    let result;

    switch (method) {
      case 'initialize':
        result = await server.initialize();
        break;

      case 'tools/list':
        result = await server.listTools();
        break;

      case 'tools/call':
        result = await server.callTool(params.name, params.arguments || {});
        break;

      default:
        throw new Error(`Unknown method: ${method}`);
    }

    return {
      jsonrpc: '2.0',
      id: id,
      result: result
    };
  } catch (error) {
    return {
      jsonrpc: '2.0',
      id: id,
      error: {
        code: -32603,
        message: error.message
      }
    };
  }
}

/**
 * Main Server Loop (stdio transport)
 */
let buffer = '';

process.stdin.setEncoding('utf8');

process.stdin.on('data', async (chunk) => {
  buffer += chunk;

  // Process complete JSON-RPC messages (newline-delimited)
  const lines = buffer.split('\n');
  buffer = lines.pop(); // Keep incomplete line in buffer

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const message = JSON.parse(line);
      const response = await handleMessage(message);
      process.stdout.write(JSON.stringify(response) + '\n');
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
});

process.stdin.on('end', () => {
  process.exit(0);
});

// Handle errors gracefully
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

console.error('Render MCP Server started');
