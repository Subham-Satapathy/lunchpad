# LaunchPad dApp

A modern decentralized application built with Next.js, Solana, and Metaplex for token launches and management.

## Features

- Modern UI with Radix UI components
- Solana blockchain integration
- Metaplex token metadata support
- Dark/Light theme support
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (recommended) or npm
- Solana CLI tools (for development)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd web
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/` - Source code directory
  - `app/` - Next.js app directory
  - `components/` - Reusable UI components
  - `lib/` - Utility functions and shared logic
  - `styles/` - Global styles and Tailwind configuration

## Tech Stack

- **Framework**: Next.js 15.3.1
- **Language**: TypeScript
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Blockchain**: Solana Web3.js
- **Token Standards**: Metaplex

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Development

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- Radix UI for accessible components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
