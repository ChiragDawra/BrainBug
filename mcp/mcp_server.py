from mcp.server import Server
from mcp.types import ToolResponse

from tools.file_tools import file_read, file_write
from tools.mongo_tools import mongo_query
from tools.codet5_tools import run_codet5_inference

server = Server("BrainBug-MCP")


# ---------------------------
# File Tools
# ---------------------------
@server.tool()
def read_file(path: str):
    """Reads and returns content of a file."""
    return ToolResponse(content=file_read(path))

@server.tool()
def write_file(path: str, text: str):
    """Writes text to a file."""
    return ToolResponse(content=file_write(path, text))


# ---------------------------
# MongoDB Tools
# ---------------------------
@server.tool()
def mongo_find(collection: str, query: str):
    """Runs a MongoDB find query."""
    return ToolResponse(content=mongo_query(collection, query))


# ---------------------------
# CodeT5 Tool
# ---------------------------
@server.tool()
def codet5_generate(code: str):
    """Runs CodeT5 inference on provided code."""
    result = run_codet5_inference(code)
    return ToolResponse(content=result)


# ---------------------------
# Main
# ---------------------------
if __name__ == "__main__":
    print("🚀 BrainBug MCP Server running...")
    server.run()
