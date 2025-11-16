const ADMIN_PASSWORD = 'admin123';
const STORAGE_KEY = 'certificates';

function getCertificates() {
    const certs = localStorage.getItem(STORAGE_KEY);
    return certs ? JSON.parse(certs) : [];
}

function saveCertificates(certificates) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
}

function generateCertificateId() {
    const prefix = 'CERT';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${id}`;
}

function ensureUniqueCertificateId() {
    const certificates = getCertificates();
    let id = generateCertificateId();
    while (certificates.some(cert => cert.id === id)) {
        id = generateCertificateId();
    }
    return id;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav-active');
        });
    }

    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    if (window.location.pathname.includes('admin.html')) {
        initAdminPage();
    }

    if (window.location.pathname.includes('verify.html')) {
        initVerifyPage();
    }

    if (window.location.pathname.includes('certificate.html')) {
        initCertificatePage();
    }
});

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 30);
}

function initAdminPage() {
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const logoutBtn = document.getElementById('logoutBtn');
    const certificateForm = document.getElementById('certificateForm');

    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            alert('Incorrect password. Please try again.');
        }
    });

    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('adminLoggedIn');
        loginSection.style.display = 'block';
        dashboardSection.style.display = 'none';
    });

    certificateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createCertificate();
    });

    function showDashboard() {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        updateDashboardStats();
        displayCertificates();
    }

    function updateDashboardStats() {
        const certificates = getCertificates();
        const uniqueStudents = new Set(certificates.map(c => c.studentName)).size;
        const uniqueCourses = new Set(certificates.map(c => c.courseName)).size;

        document.getElementById('totalCertificates').textContent = certificates.length;
        document.getElementById('totalStudents').textContent = uniqueStudents;
        document.getElementById('totalCourses').textContent = uniqueCourses;
    }

    function createCertificate() {
        const studentName = document.getElementById('studentName').value.trim();
        let courseName = document.getElementById('courseName').value;
        const customCourse = document.getElementById('customCourse').value.trim();
        const issueDate = document.getElementById('issueDate').value;

        if (courseName === 'Other' && customCourse) {
            courseName = customCourse;
        }

        const certificateId = ensureUniqueCertificateId();

        const certificate = {
            id: certificateId,
            studentName: studentName,
            courseName: courseName,
            issueDate: issueDate,
            createdAt: new Date().toISOString()
        };

        const certificates = getCertificates();
        certificates.push(certificate);
        saveCertificates(certificates);

        certificateForm.reset();
        document.getElementById('issueDate').value = new Date().toISOString().split('T')[0];
        
        alert(`Certificate created successfully!\nCertificate ID: ${certificateId}\nStudent: ${studentName}\nCourse: ${courseName}`);
        
        updateDashboardStats();
        displayCertificates();
    }

    function displayCertificates() {
        const certificates = getCertificates();
        const listContainer = document.getElementById('certificatesList');

        if (certificates.length === 0) {
            listContainer.innerHTML = '<p class="empty-state">No certificates created yet.</p>';
            return;
        }

        certificates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        listContainer.innerHTML = certificates.map(cert => `
            <div class="certificate-item">
                <div class="certificate-info">
                    <h4>${cert.studentName}</h4>
                    <p><strong>Course:</strong> ${cert.courseName}</p>
                    <p><strong>Certificate ID:</strong> ${cert.id}</p>
                    <p><strong>Issue Date:</strong> ${formatDate(cert.issueDate)}</p>
                </div>
                <div class="certificate-actions-list">
                    <a href="${getBaseUrl()}certificate.html#${cert.id}" target="_blank" class="btn btn-primary btn-small">
                        <i class="fas fa-eye"></i> View
                    </a>
                    <button onclick="deleteCertificate('${cert.id}')" class="btn btn-secondary btn-small">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function deleteCertificate(id) {
    if (confirm('Are you sure you want to delete this certificate?')) {
        const certificates = getCertificates();
        const filtered = certificates.filter(cert => cert.id !== id);
        saveCertificates(filtered);
        
        if (window.location.pathname.includes('admin.html')) {
            const event = new Event('DOMContentLoaded');
            document.dispatchEvent(event);
        }
        
        location.reload();
    }
}

function initVerifyPage() {
    const verifyForm = document.getElementById('verifyForm');
    
    verifyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        verifyCertificate();
    });

    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');
    if (certId) {
        document.getElementById('certificateIdInput').value = certId;
        verifyCertificate();
    }
}

function verifyCertificate() {
    const certificateId = document.getElementById('certificateIdInput').value.trim().toUpperCase();
    const resultDiv = document.getElementById('verifyResult');
    const validResult = document.getElementById('validResult');
    const invalidResult = document.getElementById('invalidResult');

    const certificates = getCertificates();
    const certificate = certificates.find(cert => cert.id.toUpperCase() === certificateId);

    resultDiv.style.display = 'block';

    if (certificate) {
        validResult.style.display = 'block';
        invalidResult.style.display = 'none';

        document.getElementById('resultStudentName').textContent = certificate.studentName;
        document.getElementById('resultCourseName').textContent = certificate.courseName;
        document.getElementById('resultIssueDate').textContent = formatDate(certificate.issueDate);
        document.getElementById('resultCertId').textContent = certificate.id;
        
        const certUrl = `${getBaseUrl()}certificate.html#${certificate.id}`;
        document.getElementById('viewCertLink').href = certUrl;
    } else {
        validResult.style.display = 'none';
        invalidResult.style.display = 'block';
    }
}

function initCertificatePage() {
    function loadCertificate() {
        const hash = window.location.hash.substring(1);
        
        if (!hash) {
            showCertificateNotFound();
            return;
        }

        const certificates = getCertificates();
        const certificate = certificates.find(cert => cert.id === hash);

        if (!certificate) {
            showCertificateNotFound();
            return;
        }

        displayCertificate(certificate);
    }

    loadCertificate();

    window.addEventListener('hashchange', loadCertificate);

    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
}

function showCertificateNotFound() {
    document.getElementById('certificateNotFound').style.display = 'block';
    document.getElementById('certificateContent').style.display = 'none';
}

function displayCertificate(certificate) {
    document.getElementById('certificateNotFound').style.display = 'none';
    document.getElementById('certificateContent').style.display = 'block';

    document.getElementById('certStudentName').textContent = certificate.studentName;
    document.getElementById('certCourseName').textContent = certificate.courseName;
    document.getElementById('certId').textContent = certificate.id;
    document.getElementById('certDate').textContent = formatDate(certificate.issueDate);

    document.title = `Certificate - ${certificate.studentName}`;

    const verifyUrl = `${getBaseUrl()}verify.html?id=${certificate.id}`;
    
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';
    
    new QRCode(qrcodeContainer, {
        text: verifyUrl,
        width: 150,
        height: 150,
        colorDark: '#1e293b',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

function getBaseUrl() {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const pathname = window.location.pathname;
    const directory = pathname.substring(0, pathname.lastIndexOf('/') + 1);
    return `${protocol}//${host}${directory}`;
}
