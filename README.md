# Xverse Ordinals Explorer

A React application for exploring Bitcoin Ordinals inscriptions using the Xverse API.

## Features

- Search inscriptions by Bitcoin address
- View inscription details and metadata
- Virtualized list for efficient rendering of large datasets
- Caching system for improved performance
- Responsive design

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- React Testing Library & Jest
- SCSS Modules
- Axios for API calls
- React Virtualized for efficient list rendering

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xverse.git
cd xverse
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Testing

The project includes unit tests for core functionality. To run the tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── context/           # React context for state management
├── services/          # API services and utilities
├── types/             # TypeScript type definitions
├── views/             # Page components
└── __mocks__/         # Test mocks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## API Integration

The application integrates with the Xverse API (v1) to fetch ordinal inscriptions and their details. The base URL for the API is `https://api-3.xverse.app/v1`.

### Key Endpoints:

- `/address/{address}/ordinal-utxo` - Get ordinals for an address
- `/address/{address}/ordinals/inscriptions/{inscriptionId}` - Get inscription details
