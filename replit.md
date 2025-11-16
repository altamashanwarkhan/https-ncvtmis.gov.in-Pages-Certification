# AK INSTITUTE PVT LTD - Certificate Verification System

## Overview
A modern, professional certificate verification system website built with pure HTML, CSS, and JavaScript. The website features an admin panel for creating certificates, a verification system for checking certificate authenticity, and automatically generated QR codes for each certificate.

## Project Status
**Status:** Fully Functional
**Last Updated:** November 16, 2025

## Features
- **Homepage:** JITI Institute-inspired design with hero section, course cards, animated statistics counters, testimonials, and responsive layout
- **Admin Panel:** Password-protected dashboard for creating certificates (default password: admin123)
- **Certificate Creation:** Auto-generated certificate IDs, customizable course names, student names, and issue dates
- **Certificate Display:** Professional certificate layout with QR codes linking to verification URL
- **Verification System:** Public verification page where anyone can verify certificate authenticity by entering the certificate ID
- **Public Certificate URLs:** Each certificate has a unique URL (e.g., certificate.html#CERT-ABC123)
- **QR Code Generation:** Automatic QR code generation on certificates that links to verification page
- **Responsive Design:** Mobile-friendly design that works on all devices
- **localStorage:** Certificate data persistence using browser localStorage (no backend required)

## Tech Stack
- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript
- **QR Code Library:** QRCode.js
- **Icons:** Font Awesome 6.4.0
- **Fonts:** Google Fonts (Poppins)
- **Server:** Python HTTP Server (for local development)

## Project Structure
```
/
├── index.html          # Homepage with courses and testimonials
├── admin.html          # Admin panel for certificate creation
├── verify.html         # Certificate verification page
├── certificate.html    # Certificate display page
├── css/
│   └── style.css      # All styles (modern, responsive design)
├── js/
│   ├── app.js         # Main application logic
│   └── qrcode.min.js  # QR code generation library
└── assets/
    └── img/           # Images folder (placeholder)
```

## How to Use

### Admin Panel
1. Navigate to `admin.html`
2. Enter password: `admin123`
3. Fill in student name, select/enter course name, and set issue date
4. Certificate ID is auto-generated
5. Click "Create Certificate" to generate a new certificate
6. View all created certificates in the dashboard
7. Click "View" to see the certificate or "Delete" to remove it

### Certificate Verification
1. Navigate to `verify.html`
2. Enter the certificate ID (e.g., CERT-ABC123)
3. Click "Verify" to check authenticity
4. View certificate details and click "View Certificate" to see the full certificate

### Certificate Public URL
Each certificate is accessible at: `certificate.html#CERT-ID`
- Example: `certificate.html#CERT-ABC123`
- QR codes on certificates link to the verification page

## Data Storage
- Uses browser localStorage for certificate data
- Data persists across browser sessions
- Data is stored in JSON format under the key "certificates"
- Each certificate contains: id, studentName, courseName, issueDate, createdAt

## Customization
To customize the website:
- **Colors:** Edit CSS variables in `css/style.css` (`:root` section)
- **Courses:** Add more courses in the admin dropdown in `admin.html`
- **Admin Password:** Change `ADMIN_PASSWORD` in `js/app.js`
- **Institute Name:** Currently set to "AK INSTITUTE PVT LTD"

## Deployment
The website is a static site and can be deployed to:
- Replit (using Python HTTP server)
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## Security Notes
- Admin password is stored in JavaScript (not secure for production)
- For production use, implement proper backend authentication
- localStorage data is accessible to anyone with browser access
- Consider implementing server-side certificate storage for production

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive design)

## Workflow
- **webserver:** Runs Python HTTP server on port 5000
- Command: `python3 -m http.server 5000`
- Access: Available through Replit webview

## Contact Information
- **Email:** altamashanwarkhan@gmail.com
- **Phone:** +91 9661084858

## Recent Changes
- November 16, 2025: Initial project creation with complete certificate verification system
- Implemented JITI Institute-inspired design
- Added QR code generation for certificates
- Created admin panel with password protection
- Built verification system with localStorage
- Updated institute branding to "AK INSTITUTE PVT LTD"
- Updated contact information: altamashanwarkhan@gmail.com, +91 9661084858
