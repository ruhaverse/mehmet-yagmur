# Contributing to Mehmet Yagmur

Thank you for your interest in contributing to Mehmet Yagmur! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js >= 20
- npm or yarn
- Git
- React Native development environment
- Docker & Docker Compose (for backend services)

### Setting Up Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mehmet-yagmur.git
   cd mehmet-yagmur
   ```

2. **Create Environment Files**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Install Dependencies**
   ```bash
   # Mobile app
   cd MehmetYagmurApp
   npm install --legacy-peer-deps
   
   # Backend services (if needed)
   cd backend/services/api-gateway
   npm install
   ```

4. **Start Development**
   ```bash
   # Start mobile app
   cd MehmetYagmurApp
   npm start
   
   # Start backend services
   docker-compose up -d
   ```

## 📝 Code Style

### JavaScript/TypeScript

We use ESLint and Prettier for code formatting:

```bash
# Check code style
cd MehmetYagmurApp
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Coding Standards

- Use TypeScript for new code in MehmetYagmurApp
- Follow existing code patterns and conventions
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### File Naming

- React components: `PascalCase.tsx`
- Utilities/helpers: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE.ts`
- Styles: `styles.ts` or component name with `.styles.ts`

## 🔄 Git Workflow

### Branch Naming

- Feature: `feature/description`
- Bug fix: `bugfix/description`
- Hotfix: `hotfix/description`
- Refactor: `refactor/description`

Example: `feature/add-user-profile-page`

### Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality

fix(feed): resolve infinite scroll issue

docs(readme): update setup instructions

refactor(posts): optimize post loading performance
```

### Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow the code style guidelines
   - Add tests if applicable

3. **Test Your Changes**
   ```bash
   # Run linter
   npm run lint
   
   # Run tests
   npm test
   
   # Test the app manually
   npm run android  # or ios
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill in the PR template
   - Link any related issues
   - Request review from maintainers

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Ensure all tests pass
- Include screenshots for UI changes
- Respond to review comments promptly
- Squash commits before merging if needed

## 🧪 Testing

### Running Tests

```bash
# Mobile app tests
cd MehmetYagmurApp
npm test

# Backend service tests
cd backend/services/[service-name]
npm test
```

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Aim for good test coverage
- Test edge cases and error scenarios

## 📚 Documentation

### When to Update Documentation

- Adding new features
- Changing existing functionality
- Fixing bugs that affect usage
- Updating dependencies
- Modifying configuration

### Documentation Files

- `README.md`: Main project documentation
- `dev-guide/`: Development guides
- Code comments: For complex logic
- Inline JSDoc: For functions and components

## 🐛 Bug Reports

### Before Submitting

- Check if the bug has already been reported
- Try to reproduce the issue
- Gather relevant information

### Bug Report Should Include

- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots/videos if applicable
- Error messages or logs

## 💡 Feature Requests

### Before Submitting

- Check if the feature has been requested
- Ensure it aligns with project goals
- Consider if it could be a plugin/extension

### Feature Request Should Include

- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Examples from other apps (if applicable)

## 🔐 Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities.

Instead:
- Email the maintainers directly
- Provide detailed information
- Allow time for a fix before public disclosure

### Security Best Practices

- Never commit secrets or credentials
- Use environment variables for sensitive data
- Keep dependencies updated
- Follow OWASP guidelines
- Use HTTPS for all external communications

## 🎯 Backend Service Development

### Creating a New Service

1. Use existing services as templates
2. Include proper error handling
3. Add health check endpoint
4. Create Dockerfile
5. Update docker-compose.yml
6. Add .env.example
7. Document API endpoints

### Service Structure

```
service-name/
├── index.js           # Entry point
├── routes/            # API routes
├── controllers/       # Business logic
├── models/            # Data models
├── middleware/        # Custom middleware
├── utils/             # Helper functions
├── tests/             # Service tests
├── Dockerfile         # Docker config
├── package.json       # Dependencies
└── .env.example       # Environment template
```

## 📱 Mobile App Development

### Component Guidelines

- Use functional components with hooks
- Keep components small and reusable
- Use TypeScript for type safety
- Follow React Native best practices
- Optimize for performance

### State Management

- Use Redux Toolkit for global state
- Use local state for component-specific data
- Keep state minimal and normalized
- Use selectors for derived data

### Navigation

- Use React Navigation 7.x
- Follow navigation patterns in the app
- Handle deep linking properly
- Consider navigation guards for auth

## 🤝 Code Review

### As a Reviewer

- Be constructive and respectful
- Explain reasoning behind suggestions
- Approve when satisfied
- Request changes if needed

### As an Author

- Respond to all comments
- Make requested changes
- Ask for clarification if needed
- Thank reviewers for their time

## 📞 Getting Help

- Check existing documentation
- Search closed issues
- Ask in pull request discussions
- Contact maintainers if needed

## 🎓 Learning Resources

- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Docker Documentation](https://docs.docker.com/)

## 📄 License

By contributing to Mehmet Yagmur, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Mehmet Yagmur! 🎉
