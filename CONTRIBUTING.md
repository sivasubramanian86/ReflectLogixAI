# Contributing to ReflectLogixAI

We welcome contributions from developers, AI researchers, and designers!

## Development Workflow

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start local development:
   ```bash
   npm run dev
   ```

4. Run linting and type checks:
   ```bash
   npm run lint
   npm run build
   ```

5. Submit a Pull Request targeting `main` using our PR template.

## Code Standards
- **TypeScript**: Strict mode enabled.
- **Styling**: Tailwind CSS with designated semantic tokens.
- **Security**: No client-side exposure of API keys; all Gemini interactions must route through the server proxy.
