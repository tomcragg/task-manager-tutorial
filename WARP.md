# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Installation and Setup
```bash
# Install dependencies (required before running tests)
npm install

# Alternative: Clean install
npm ci
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode (auto-reruns on file changes)
npm test:watch

# Run tests with coverage report
npm test -- --coverage

# Run a specific test file
npm test tests/app.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="should add"
```

### Development Server
```bash
# Open the application locally (no build server needed)
start index.html  # Windows
open index.html    # macOS
xdg-open index.html # Linux
```

### CI/CD Workflows
```bash
# Manually trigger GitHub Actions workflows
gh workflow run ci.yml
gh workflow run deploy.yml

# View workflow runs
gh run list --workflow=ci.yml
gh run list --workflow=deploy.yml

# Check specific workflow run details
gh run view [run-id]
```

## Architecture Overview

### Application Structure
This is a vanilla JavaScript task manager application with the following architecture:

**Frontend Entry Point**: `index.html` serves as the single-page application entry point, loading the CSS and JavaScript resources.

**Core Application Logic**: The `TaskManager` class in `js/app.js` implements:
- Task CRUD operations (Create, Read, Update via toggle, Delete)
- LocalStorage persistence layer for data persistence across sessions
- Task filtering system (All, Active, Completed states)
- Event-driven architecture using DOM event listeners

**State Management**: Tasks are stored as an array of objects with the following schema:
- `id`: Timestamp-based unique identifier
- `text`: Task description
- `completed`: Boolean completion status
- `createdAt`: ISO timestamp for creation tracking

**Data Flow**:
1. User interactions trigger DOM events
2. TaskManager methods handle business logic
3. State changes are persisted to localStorage
4. UI updates via `renderTasks()` method

### Testing Strategy
The application uses Jest with jsdom for unit testing:
- Mock DOM environment setup in `tests/setup.js`
- Component testing approach in `tests/app.test.js`
- Tests cover core functionality: task addition, completion toggling, deletion, and counting

### CI/CD Pipeline
**GitHub Actions Workflows**:

1. **Continuous Integration** (`ci.yml`):
   - Triggers on pushes to main/develop branches and PRs
   - Matrix testing across Node.js versions (18.x, 20.x, 22.x)
   - Runs tests with coverage reporting
   - Creates build artifacts for deployment readiness

2. **Deployment** (`deploy.yml`):
   - Auto-deploys to GitHub Pages on main branch pushes
   - Static site deployment without build compilation
   - Accessible at the repository's GitHub Pages URL

### Module System
The application uses a dual module approach:
- Browser environment: Global `taskManager` instance initialization
- Node.js environment: CommonJS exports for testing compatibility
- Conditional initialization based on environment detection (lines 136-144 in app.js)

## Key Development Patterns

### localStorage Operations
All task persistence happens through the `saveTasks()` method which serializes the tasks array to JSON. Recovery happens in the constructor by parsing stored JSON or initializing an empty array.

### Event Delegation
Task actions (complete/delete buttons) use inline onclick handlers that reference the global `taskManager` instance, enabling dynamic list rendering without re-binding events.

### Filter System
The filtering mechanism manipulates CSS display properties rather than re-rendering the task list, providing efficient view switching without DOM manipulation overhead.

## Node.js Compatibility

### Current Requirements
- **Minimum Node.js Version**: 18.14.0+
- **Jest Version**: 30.x requires Node.js 18+
- **CI Testing**: Runs on Node.js 18.x, 20.x, and 22.x

### Version Compatibility Issues
If you encounter `TypeError: (0, _os(...).availableParallelism) is not a function` errors:

1. **Root Cause**: Jest 30.x uses `os.availableParallelism()` which requires Node.js 18.14.0+
2. **Solutions**:
   - **Recommended**: Upgrade to Node.js 18+ (Node.js 16 reached EOL in Sept 2023)
   - **Alternative**: Downgrade Jest to 29.x for Node.js 16 compatibility

```bash
# Check your Node.js version
node --version

# If using Node.js 16.x and need compatibility, downgrade Jest:
npm install --save-dev jest@^29.7.0 jest-environment-jsdom@^29.7.0
```
