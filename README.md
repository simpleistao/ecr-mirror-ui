# ECR Mirror Service UI

A modern, premium web interface for managing the mirroring of Container Images and Helm Charts to AWS ECR.

![App Screenshot](public/screenshot.png)

## Features

- **Mirror Request Dashboard**: Submit synchronous requests to mirror images/charts from public registries to your private ECR.
- **Configuration Management**: View and propose changes to registry mappings via simulated Pull Requests.
- **ECR Explorer**: Browse and inspect repositories and images in your private ECR registry.
- **Premium UI**: Built with React, TypeScript, and Glassmorphism design principles.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/simpleistao/ecr-mirror-ui.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## Configuration

The application connects to a backend API. By default, it runs in **Mock Mode** for demonstration purposes.

To connect to a real backend:
1. Open `src/services/api.ts`
2. Set `const USE_MOCK = false;`
3. Configure your API base URL if needed via `.env`:
   ```
   VITE_API_BASE_URL=http://your-backend-api.com
   ```

## Tech Stack

- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Modules approach) + Lucide Icons
- **Routing**: React Router DOM

## License

Internal Use Only.
