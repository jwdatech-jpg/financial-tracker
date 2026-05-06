import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from app.main import app

# Export app for Vercel
__all__ = ["app"]
