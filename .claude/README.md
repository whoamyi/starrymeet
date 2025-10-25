# Claude MCP Configuration for StarryMeet

This directory contains MCP (Model Context Protocol) server configurations that extend Claude's capabilities.

## Render MCP Server

Allows Claude to interact with Render deployment platform for auto-debugging and deployment management.

### Files

- **render-mcp.json** - MCP server configuration
- **auto-deploy.js** - Node.js MCP server implementation

### Features

The Render MCP server provides the following tools:

1. **check_deploy_status** - Check current deployment status and recent deployments
2. **fetch_deploy_logs** - Fetch and analyze deployment logs
3. **trigger_deploy** - Trigger a new deployment (with optional cache clearing)
4. **get_service_info** - Get service configuration and environment variables

### Setup

#### 1. Add to Claude Desktop Config

Add this to your Claude Desktop MCP configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "render": {
      "command": "node",
      "args": ["/absolute/path/to/starrymeet/.claude/auto-deploy.js"],
      "env": {
        "RENDER_API_KEY": "your_render_api_key",
        "RENDER_SERVICE_ID": "your_service_id"
      }
    }
  }
}
```

#### 2. Get Render Credentials

1. **API Key**: Get from https://dashboard.render.com/account/api-keys
2. **Service ID**:
   - Go to your service dashboard
   - URL format: `https://dashboard.render.com/web/srv-xxxxx`
   - The `srv-xxxxx` part is your Service ID

#### 3. Restart Claude Desktop

After adding the configuration, restart Claude Desktop to load the MCP server.

### Usage

Once configured, you can ask Claude to:

- "Check the Render deployment status"
- "Show me the latest deployment logs"
- "Trigger a new deployment on Render"
- "What are the environment variables configured on Render?"

### Security Notes

⚠️ **IMPORTANT**:
- Never commit API keys to git
- The `.claude/render-mcp.json` file should be added to `.gitignore`
- API keys have full access to your Render account

### Troubleshooting

**MCP server not showing up:**
1. Check Claude Desktop logs for errors
2. Verify the absolute path in the config
3. Make sure Node.js is installed and in PATH

**Authentication errors:**
1. Verify your RENDER_API_KEY is valid
2. Check that the Service ID is correct
3. Ensure the API key has access to the service

**Test the server manually:**
```bash
# Set environment variables
export RENDER_API_KEY="your_key"
export RENDER_SERVICE_ID="srv-xxxxx"

# Run the server (it will wait for JSON-RPC messages)
node .claude/auto-deploy.js
```

### API Reference

The server implements the Model Context Protocol specification:
- Protocol Version: 2024-11-05
- Transport: stdio
- Message Format: JSON-RPC 2.0

For more info: https://modelcontextprotocol.io/
