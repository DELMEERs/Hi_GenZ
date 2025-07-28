# Security Policy

## Supported Versions

| Version | Security Support |
| ------- | ------------------ |
| Current Main Branch | ✅ |
| Light Version | ✅ |

## Vulnerability Report

Hi, GenZ! is a client-side web application without a server-side, but we take user security seriously.

### How to report a vulnerability

1. **DO NOT create a public issue** for security vulnerabilities
2. Send an email to: **xd3ll.d9l@gmail.com** with the subject "SECURITY"

### Information to include in the report

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Proposed solution (if any)
- Your contact information for communication

### What we do with reports

1. **Acknowledgment** of receipt within 48 hours
2. **Assessment** of vulnerability severity
3. **Develop** a fix
4. **Test** the solution
5. **Release** the update
6. **Publicly disclose** after fix

### Types of vulnerabilities to watch out for

Because Hi, GenZ! - this is a frontend application:

- **XSS (Cross-Site Scripting)** - in handling user input
- **Insecure password generation** - weak algorithms
- **Data leak** - storing passwords in localStorage/sessionStorage
- **Clickjacking** - no protection against embedding
- **CSP violations** - insecure inline scripts

### What is NOT a vulnerability

- Using HTTP instead of HTTPS on localhost
- No authentication (the application is public)
- Ability to view source code (open source)
- Performance issues

### Acknowledgment

Security researchers who responsibly disclose vulnerabilities will be:
- Mentioned in the CHANGELOG (with their consent)
- Added to the SECURITY.md file as Contributors

### Contacts

- **Primary Contact**: xd3ll.d9l@gmail.com
- **GitHub**: @DELMEERs

---

**Thanks for helping keep Hi GenZ safe!** 🔒