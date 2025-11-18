# Contributing Guidelines

Thank you for your interest in contributing to Crown Majestic Kitchen's website!

## Development Workflow

1. **Setup**
   ```bash
   git clone <repo-url>
   cd crown
   npm install
   cp .env.example .env.local
   # Fill in your environment variables
   npm run dev
   ```

2. **Make Changes**
   - Create a feature branch: `git checkout -b feature/your-feature`
   - Make your changes
   - Test locally
   - Commit with clear messages

3. **Code Style**
   - Run `npm run lint` before committing
   - Use TypeScript for type safety
   - Follow existing code patterns
   - Add comments for complex logic

4. **Testing**
   - Test on multiple browsers
   - Test responsive design
   - Check accessibility
   - Verify no console errors

5. **Submit**
   - Push your branch
   - Create a pull request
   - Describe your changes clearly

## Code Standards

- **TypeScript**: Use proper types, avoid `any`
- **Components**: Functional components with TypeScript
- **Styling**: Use Tailwind CSS classes
- **Files**: Use kebab-case for files
- **Imports**: Use absolute imports with `@/`

## Pull Request Process

1. Update documentation if needed
2. Ensure build passes (`npm run build`)
3. Request review
4. Address feedback
5. Merge after approval

## Questions?

Contact: contact@crownmajestic.com
