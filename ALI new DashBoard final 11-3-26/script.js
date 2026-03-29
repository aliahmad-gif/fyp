// Global state management
const authState = {
    currentUser: null,
    userRole: null,
    userEmail: null
};

// Role Selection Page (Image 32)
document.addEventListener('DOMContentLoaded', function () {
    // Check which page we're on
    const currentPage = window.location.pathname;

    // Initialize role selection only on index page
    if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
        initializeRoleSelection();
    }

    // Initialize forms if they exist
    if (document.querySelectorAll('form').length > 0) {
        initializeForms();
    }

    // Initialize password toggles if they exist
    if (document.querySelectorAll('.password-toggle').length > 0) {
        initializePasswordToggles();
    }

    // Initialize code inputs if they exist
    if (document.querySelectorAll('.code-input').length > 0) {
        initializeCodeInputs();
    }

    // Initialize back buttons if they exist
    if (document.querySelectorAll('.back-button').length > 0) {
        initializeBackButtons();
    }
});

function initializeRoleSelection() {
    const userRadio = document.getElementById('user-role');
    const tailorRadio = document.getElementById('tailor-role');
    const sellerRadio = document.getElementById('seller-role');
    const continueBtn = document.getElementById('continueBtn');
    const skipBtn = document.getElementById('skipBtn');

    if (continueBtn) {
        continueBtn.addEventListener('click', function () {
            let selectedRole = 'user';

            if (tailorRadio && tailorRadio.checked) {
                selectedRole = 'tailor';
            } else if (sellerRadio && sellerRadio.checked) {
                selectedRole = 'seller';
            }

            // Store selected role
            localStorage.setItem('userRole', selectedRole);
            authState.userRole = selectedRole;

            // Redirect based on role
            switch (selectedRole) {
                case 'user':
                    window.location.href = 'user-flow/user-login.html';
                    break;
                case 'tailor':
                    window.location.href = 'tailor-flow/tailor-login.html';
                    break;
                case 'seller':
                    window.location.href = 'seller-flow/seller-login.html';
                    break;
                default:
                    window.location.href = 'user-flow/user-login.html';
            }
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', function () {
            localStorage.setItem('userRole', 'user');
            window.location.href = 'user-flow/user-login.html';
        });
    }
}

function initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    });
}

function handleFormSubmit(form) {
    const formId = form.id || 'unknown';
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    const codeInputs = form.querySelectorAll('.code-input');

    if (emailInput) {
        authState.userEmail = emailInput.value;
        localStorage.setItem('userEmail', emailInput.value);
    }

    switch (formId) {
        case 'loginForm':
            const password = passwordInputs[0]?.value;
            handleLogin(emailInput?.value, password);
            break;
        case 'registerForm':
            const password1 = passwordInputs[0]?.value;
            const password2 = passwordInputs[1]?.value;
            handleRegister(emailInput?.value, password1, password2);
            break;
        case 'forgotPasswordForm':
            handleForgotPassword(emailInput?.value);
            break;
        case 'verifyCodeForm':
            const code = Array.from(codeInputs).map(input => input.value).join('');
            handleVerifyCode(code);
            break;
        default:
            console.log('Form submitted:', formId);
    }
}

function initializePasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.parentNode.querySelector('input');
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.innerHTML = type === 'password' ?
                    '<i class="fas fa-eye"></i>' :
                    '<i class="fas fa-eye-slash"></i>';
            }
        });
    });
}

function initializeCodeInputs() {
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach((input, index) => {
        input.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');

            if (this.value.length === 1 && index < codeInputs.length - 1) {
                codeInputs[index + 1].focus();
            }

            const allFilled = Array.from(codeInputs).every(input => input.value.length === 1);
            if (allFilled) {
                const form = this.closest('form');
                if (form) {
                    setTimeout(() => {
                        form.dispatchEvent(new Event('submit'));
                    }, 300);
                }
            }
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });
}

function initializeBackButtons() {
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Go to index if no history
                window.location.href = '../index.html';
            }
        });
    });
}

function handleLogin(email, password) {
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    showAlert('Login successful! Redirecting...', 'success');

    // Simulate login process
    setTimeout(() => {
        // Get user role from localStorage or default to 'user'
        let role = localStorage.getItem('userRole');

        // Infer role from URL if not set or generic
        if (window.location.href.includes('seller-flow') || window.location.href.includes('seller-login')) {
            role = 'seller';
        } else if (window.location.href.includes('tailor-flow') || window.location.href.includes('tailor-login')) {
            role = 'tailor';
        }

        if (!role) role = 'user';

        // Store login info
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', email);
        localStorage.setItem('userRole', role);

        // Redirect to dashboard
        if (role === 'seller') {
            window.location.href = '../Sellerdashborad/bottom_navi.html';
        } else if (role === 'tailor') {
            window.location.href = '../tailor nauman front end dashboard tailor/tailor nauman front end dashboard tailor/index.html';
        } else {
            window.location.href = `dashboard-${role}.html`;
        }
    }, 1500);
}

function handleRegister(email, password, confirmPassword) {
    if (!email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }

    // Store registration data
    const userData = {
        email: email,
        role: localStorage.getItem('userRole') || 'user',
        registeredAt: new Date().toISOString()
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userEmail', email);

    showAlert('Registration successful! Please verify your email.', 'success');

    // Redirect to verification page
    setTimeout(() => {
        const role = localStorage.getItem('userRole') || 'user';
        window.location.href = `${role}-flow/${role}-verify.html`;
    }, 1500);
}

function handleForgotPassword(email) {
    if (!email) {
        showAlert('Please enter your email address', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Generate verification code
    const verificationCode = '123456'; // Fixed code for demo
    localStorage.setItem('verificationCode', verificationCode);
    localStorage.setItem('resetEmail', email);

    showAlert(`Verification code sent to ${email}`, 'success');

    // Redirect to verification page
    setTimeout(() => {
        const role = localStorage.getItem('userRole') || 'user';
        window.location.href = `${role}-flow/${role}-verify.html`;
    }, 1500);
}

function handleVerifyCode(code) {
    if (code.length !== 6 || !/^\d+$/.test(code)) {
        showAlert('Please enter a valid 6-digit code', 'error');
        return;
    }

    // For demo, accept code '123456'
    const storedCode = localStorage.getItem('verificationCode');

    if (code === storedCode || code === '123456') {
        showAlert('Code verified successfully!', 'success');

        setTimeout(() => {
            const role = localStorage.getItem('userRole') || 'user';
            showAlert(`Welcome! Your ${role} account is now active.`, 'success');
            window.location.href = `dashboard-${role}.html`;
        }, 1500);
    } else {
        showAlert('Invalid verification code. Please try again.', 'error');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close">&times;</button>
    `;

    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        ${type === 'success' ? 'background: #4CAF50;' : 'background: #f44336;'}
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(alertDiv);

    // Close button
    const closeBtn = alertDiv.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alertDiv.remove();
    });

    // Auto remove
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Add CSS for animations
if (!document.querySelector('#alert-animations')) {
    const style = document.createElement('style');
    style.id = 'alert-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .alert-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .alert-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s;
        }
        
        .alert-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);
}

// Dashboard page demo (create these files too)
function createDashboard(role) {
    const dashboardHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: Arial, sans-serif;
                background: #f5f5f5;
            }
            .dashboard {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            header {
                background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
            }
            .user-info {
                margin-top: 10px;
                font-size: 14px;
                opacity: 0.9;
            }
            .cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            .card {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .logout-btn {
                background: #f44336;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="dashboard">
            <header>
                <h1>Welcome to ${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</h1>
                <div class="user-info">
                    <p>Email: ${localStorage.getItem('userEmail') || 'user@example.com'}</p>
                    <p>Role: ${role}</p>
                </div>
            </header>
            <div class="cards">
                <div class="card">
                    <h3>Profile</h3>
                    <p>Manage your account settings</p>
                </div>
                <div class="card">
                    <h3>Activities</h3>
                    <p>View your recent activities</p>
                </div>
                <div class="card">
                    <h3>Settings</h3>
                    <p>Customize your preferences</p>
                </div>
            </div>
            <button class="logout-btn" onclick="logout()">Logout</button>
        </div>
        <script>
            function logout() {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('currentUser');
                window.location.href = '../index.html';
            }
        </script>
    </body>
    </html>`;

    // Create and save dashboard file
    const blob = new Blob([dashboardHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${role}.html`;
    a.click();
}

// Verify page کے شروع میں یہ کوڈ شامل کریں
document.addEventListener('DOMContentLoaded', function () {
    // localStorage سے email حاصل کریں
    const savedEmail = localStorage.getItem('userEmail');
    const resetEmail = localStorage.getItem('resetEmail');

    // کون سا email استعمال کرنا ہے
    const emailToDisplay = savedEmail || resetEmail || 'user@example.com';

    // email ڈسپلے کریں
    const emailElement = document.querySelector('.email-placeholder');
    if (emailElement) {
        emailElement.textContent = emailToDisplay;
    }
});

function handleForgotPassword(email) {
    if (!email) {
        showAlert('Please enter your email address', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('verificationCode', verificationCode);
    localStorage.setItem('resetEmail', email);
    localStorage.setItem('userEmail', email);

    showAlert(`Verification code ${verificationCode} sent to ${email}`, 'success');

    // Redirect to verification page
    setTimeout(() => {
        const role = localStorage.getItem('userRole') || 'user';

        // تمام role کے لیے ایک ہی verify.html page استعمال کریں
        // یا role-specific verify page
        window.location.href = `${role}-verify.html`;
    }, 1500);
}
// Create dashboard files if needed
window.createDashboard = createDashboard;