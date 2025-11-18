# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

**DO NOT** create a public GitHub issue.

Instead, please email: security@crownmajestic.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work to address the issue promptly.

## Security Best Practices

This project follows these security practices:

✅ **Environment Variables**: All sensitive data in `.env.local` (git-ignored)  
✅ **API Keys**: Never exposed in client-side code  
✅ **Security Headers**: Configured in `next.config.ts`  
✅ **Dependencies**: Regular updates via `npm audit`  
✅ **XSS Protection**: Enabled via headers  
✅ **HTTPS**: Required in production  
✅ **CSP**: Content Security Policy configured  

## Secure Configuration

### API Keys
- Store in environment variables
- Restrict API keys in Google Cloud Console
- Rotate keys if compromised
- Never commit to version control

### Production
- Enable HTTPS
- Use secure headers
- Validate all inputs
- Sanitize user data
- Keep dependencies updated

## Updates

Run security audits regularly:
```bash
npm audit
npm audit fix
```

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Contact

For security concerns: security@crownmajestic.com
