# Contributing to RGR Logistics Website

Thank you for your interest in contributing to the RGR Logistics website! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm 8+
- Git
- Modern web browser
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/rgr-logistics-website.git
   cd rgr-logistics-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   ```
   http://localhost:3000
   ```

## 📋 Development Guidelines

### Code Style

We use ESLint and Prettier for consistent code formatting:

```bash
# Check linting
npm run lint:check

# Fix linting issues
npm run lint

# Check formatting
npm run format:check

# Format code
npm run format
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(contact): add form validation
fix(nav): resolve mobile menu toggle issue
docs(readme): update installation instructions
style(css): improve button hover effects
```

### Branch Naming

Use descriptive branch names:
- `feature/contact-form-validation`
- `fix/mobile-navigation-bug`
- `docs/update-readme`
- `refactor/optimize-images`

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Writing Tests

- Place test files in the `tests/` directory
- Use descriptive test names
- Test both positive and negative cases
- Aim for high test coverage (>80%)

**Example Test:**
```javascript
describe('Contact Form', () => {
  it('should validate email addresses correctly', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });
});
```

### Performance Testing

Run Lighthouse audits:
```bash
npm run lighthouse
```

Target scores:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >95

## 🎨 Design Guidelines

### UI/UX Principles

1. **Mobile-First**: Design for mobile devices first
2. **Accessibility**: Follow WCAG 2.1 AA guidelines
3. **Performance**: Optimize for fast loading
4. **Consistency**: Maintain design consistency
5. **User-Centered**: Focus on user needs

### Color Palette

```css
:root {
  --primary-color: #1e3c72;
  --secondary-color: #2a5298;
  --accent-color: #ffd700;
  --text-color: #333;
  --background-color: #fff;
  --gray-light: #f8f9fa;
  --gray-medium: #6c757d;
  --gray-dark: #343a40;
}
```

### Typography

- **Primary Font**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, sufficient contrast
- **Line Height**: 1.6 for body text

### Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1200px) { }
```

## 🔧 Technical Standards

### HTML

- Use semantic HTML5 elements
- Include proper ARIA labels
- Validate markup
- Optimize for SEO

### CSS

- Use CSS custom properties (variables)
- Follow BEM methodology for class names
- Write mobile-first responsive CSS
- Use CSS Grid and Flexbox appropriately

### JavaScript

- Use modern ES6+ syntax
- Write modular, reusable code
- Handle errors gracefully
- Optimize for performance

### Images

- Use appropriate formats (WebP with fallbacks)
- Optimize file sizes
- Include descriptive alt text
- Implement lazy loading

## 📝 Documentation

### Code Documentation

- Comment complex logic
- Use JSDoc for functions
- Keep comments up to date
- Document API endpoints

### README Updates

When adding new features:
1. Update the README.md
2. Add usage examples
3. Update the feature list
4. Include screenshots if applicable

## 🚀 Deployment

### Build Process

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

### Deployment Checklist

- [ ] All tests pass
- [ ] Lighthouse scores meet targets
- [ ] Security audit passes
- [ ] Documentation updated
- [ ] Changelog updated

## 🐛 Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, device
6. **Screenshots**: If applicable

**Bug Report Template:**
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
A clear description of what actually happened.

## Environment
- Browser: [e.g. Chrome 91]
- OS: [e.g. Windows 10]
- Device: [e.g. Desktop, iPhone 12]

## Screenshots
If applicable, add screenshots to help explain your problem.
```

## 💡 Feature Requests

When requesting features:

1. **Use Case**: Explain why this feature is needed
2. **Description**: Detailed description of the feature
3. **Mockups**: Visual mockups if applicable
4. **Priority**: How important is this feature

## 🔒 Security

### Reporting Security Issues

For security vulnerabilities:
1. **Do NOT** create a public issue
2. Email: security@rgrlogistics.com
3. Include detailed information
4. Allow time for investigation

### Security Guidelines

- Validate all user inputs
- Use HTTPS everywhere
- Implement CSP headers
- Regular security audits
- Keep dependencies updated

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Email**: tech@rgrlogistics.com

### Code Review Process

1. Create a pull request
2. Automated checks must pass
3. Request review from maintainers
4. Address feedback
5. Merge after approval

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Website credits page

## 📄 License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

---

**Thank you for contributing to RGR Logistics! 🚛✨**
