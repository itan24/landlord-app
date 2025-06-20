# Contributing Guide

Thank you for your interest in contributing to the Landlord Management App! This guide will help you get started with contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Code of Conduct](#code-of-conduct)

## Getting Started

### Prerequisites

Before contributing, make sure you have:

- Node.js 18+ installed
- Git installed
- A GitHub account
- PostgreSQL database (local or cloud)
- Code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository**
   - Go to the main repository on GitHub
   - Click the "Fork" button in the top right
   - This creates a copy in your GitHub account

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/landlord-app.git
   cd landlord-app
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/landlord-app.git
   ```

## Development Setup

### Environment Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   Create a `.env.local` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/landlord_app"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

3. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Development Tools

Install recommended VS Code extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma"
  ]
}
```

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type - use proper typing
- Use strict mode in `tsconfig.json`

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use Next.js App Router patterns
- Implement proper error boundaries

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use CSS custom properties for theming

### File Structure

```
app/
├── api/           # API routes
├── (routes)/      # Page routes
└── globals.css    # Global styles

components/
├── ui/           # Reusable UI components
└── [feature]/    # Feature-specific components

lib/
├── auth.ts       # Authentication utilities
├── db.ts         # Database utilities
└── utils.ts      # Helper functions
```

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types/Interfaces**: PascalCase (`UserProfile`)

### Comments and Documentation

- Use JSDoc comments for functions and components
- Add inline comments for complex logic
- Document API endpoints
- Keep README files updated

Example:
```typescript
/**
 * Fetches user profile data from the API
 * @param userId - The unique identifier of the user
 * @returns Promise containing user profile data
 * @throws Error if user not found or API fails
 */
async function fetchUserProfile(userId: string): Promise<UserProfile> {
  // Implementation
}
```

## Git Workflow

### Branch Naming

Use descriptive branch names:

```
feature/add-user-dashboard
bugfix/fix-login-validation
hotfix/security-patch
docs/update-api-documentation
```

### Commit Messages

Follow conventional commit format:

```
type(scope): description

feat(auth): add OAuth login with Google
fix(api): resolve profile update validation error
docs(readme): update installation instructions
style(ui): improve button hover effects
refactor(db): optimize database queries
test(api): add unit tests for profile endpoints
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Workflow Steps

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write code following standards
   - Add tests if applicable
   - Update documentation

3. **Stage and commit**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create pull request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=user-profile.test.ts
```

### Writing Tests

- Use Jest and React Testing Library
- Test user interactions, not implementation
- Write meaningful test descriptions
- Aim for good test coverage

Example test:
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { UserProfile } from './UserProfile'

describe('UserProfile', () => {
  it('should display user information correctly', () => {
    const user = {
      name: 'John Doe',
      email: 'john@example.com'
    }
    
    render(<UserProfile user={user} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn()
    const user = { name: 'John Doe', email: 'john@example.com' }
    
    render(<UserProfile user={user} onEdit={onEdit} />)
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    
    expect(onEdit).toHaveBeenCalledWith(user)
  })
})
```

## Pull Request Process

### Before Submitting

1. **Ensure code quality**
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

2. **Update documentation**
   - Update README if needed
   - Add API documentation
   - Update component documentation

3. **Test thoroughly**
   - Test on different browsers
   - Test responsive design
   - Test accessibility features

### PR Template

Use this template for pull requests:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design tested
```

### Review Process

1. **Automated checks**
   - Linting passes
   - TypeScript compilation
   - Tests pass
   - Build succeeds

2. **Code review**
   - At least one maintainer approval
   - Address review comments
   - Update code if needed

3. **Merge**
   - Squash commits if needed
   - Delete feature branch
   - Update version if necessary

## Bug Reports

### Before Reporting

1. Check existing issues
2. Search for similar problems
3. Try to reproduce the issue
4. Check browser console for errors

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 120]
- Node.js: [e.g. 18.17.0]

## Additional Information
Screenshots, console logs, etc.
```

## Feature Requests

### Before Requesting

1. Check if feature already exists
2. Consider if it fits project scope
3. Think about implementation approach
4. Consider user impact

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Alternatives Considered
Other approaches you considered

## Additional Context
Screenshots, mockups, etc.
```

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and constructive
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

- Project maintainers are responsible for enforcing standards
- Unacceptable behavior will not be tolerated
- Violators may be temporarily or permanently banned

## Getting Help

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Community

- GitHub Issues for bug reports
- GitHub Discussions for questions
- Pull requests for contributions

### Contact

- Open an issue for bugs
- Start a discussion for questions
- Email maintainers for sensitive issues

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the Landlord Management App! 🏠 