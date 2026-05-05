// ============================================================
//  AUTH SYSTEM — Sign In / Register with localStorage
// ============================================================

const Auth = (() => {
  let currentUser = JSON.parse(localStorage.getItem('amazon_user') || 'null');

  function getUser() { return currentUser; }

  function isLoggedIn() { return !!currentUser; }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem('amazon_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password.' };
    currentUser = { name: user.name, email: user.email };
    localStorage.setItem('amazon_user', JSON.stringify(currentUser));
    updateUI();
    return { success: true };
  }

  function register(name, email, password) {
    if (!name || name.length < 2) return { success: false, error: 'Please enter your full name.' };
    if (!email || !/\S+@\S+\.\S+/.test(email)) return { success: false, error: 'Please enter a valid email.' };
    if (!password || password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
    const users = JSON.parse(localStorage.getItem('amazon_users') || '[]');
    if (users.find(u => u.email === email)) return { success: false, error: 'An account with this email already exists.' };
    users.push({ name, email, password });
    localStorage.setItem('amazon_users', JSON.stringify(users));
    currentUser = { name, email };
    localStorage.setItem('amazon_user', JSON.stringify(currentUser));
    updateUI();
    return { success: true };
  }

  function logout() {
    currentUser = null;
    localStorage.removeItem('amazon_user');
    updateUI();
    showToast('info', '<i class="fa-solid fa-sign-out-alt"></i>', 'You have been signed out.');
  }

  function updateUI() {
    const navUsername = document.getElementById('navUsername');
    const megaMenuUsername = document.getElementById('megaMenuUsername');
    const signinBanner = document.getElementById('signinBanner');
    const firstName = currentUser ? currentUser.name.split(' ')[0] : 'Sign in';

    if (navUsername) navUsername.textContent = firstName;
    if (megaMenuUsername) megaMenuUsername.textContent = currentUser ? `Hello, ${firstName}` : 'Hello, Sign In';
    if (signinBanner) signinBanner.hidden = !!currentUser;
  }

  // Init
  updateUI();

  return { login, register, logout, isLoggedIn, getUser, updateUI };
})();

// ── AUTH MODAL LOGIC ──
function openAuthModal(mode = 'login') {
  document.getElementById('authModal').hidden = false;
  document.getElementById('authModalOverlay').hidden = false;
  document.body.style.overflow = 'hidden';
  if (mode === 'register') {
    document.getElementById('loginForm').hidden = true;
    document.getElementById('registerForm').hidden = false;
  } else {
    document.getElementById('loginForm').hidden = false;
    document.getElementById('registerForm').hidden = true;
  }
}

function closeAuthModal() {
  document.getElementById('authModal').hidden = true;
  document.getElementById('authModalOverlay').hidden = true;
  document.body.style.overflow = '';
}

function togglePassword() {
  const input = document.getElementById('passwordInput');
  const btn = document.querySelector('.password-toggle');
  if (input.type === 'password') { input.type = 'text'; btn.textContent = 'Hide'; }
  else { input.type = 'password'; btn.textContent = 'Show'; }
}

// Wire up auth events after DOM loads
document.addEventListener('DOMContentLoaded', () => {
  // Sign in button in navbar
  document.getElementById('signInBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('signinBannerBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('authModalClose')?.addEventListener('click', closeAuthModal);
  document.getElementById('authModalOverlay')?.addEventListener('click', closeAuthModal);
  document.getElementById('createAccountBtn')?.addEventListener('click', (e) => { e.preventDefault(); openAuthModal('register'); });
  document.getElementById('switchToRegister')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('loginForm').hidden = true; document.getElementById('registerForm').hidden = false; });
  document.getElementById('switchToLogin')?.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('loginForm').hidden = false; document.getElementById('registerForm').hidden = true; });

  document.getElementById('loginSubmit')?.addEventListener('click', () => {
    const email = document.getElementById('emailInput').value.trim();
    const password = document.getElementById('passwordInput').value;
    if (!email || !password) { showToast('error', '<i class="fa-solid fa-exclamation"></i>', 'Please fill in all fields.'); return; }
    const result = Auth.login(email, password);
    if (result.success) {
      closeAuthModal();
      showToast('success', '<i class="fa-solid fa-check"></i>', `Welcome back, ${Auth.getUser().name.split(' ')[0]}!`);
    } else {
      showToast('error', '<i class="fa-solid fa-exclamation"></i>', result.error);
    }
  });

  document.getElementById('registerSubmit')?.addEventListener('click', () => {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass1 = document.getElementById('regPassword').value;
    const pass2 = document.getElementById('regPassword2').value;
    if (pass1 !== pass2) { showToast('error', '<i class="fa-solid fa-exclamation"></i>', 'Passwords do not match.'); return; }
    const result = Auth.register(name, email, pass1);
    if (result.success) {
      closeAuthModal();
      showToast('success', '<i class="fa-solid fa-check"></i>', `Account created! Welcome, ${name.split(' ')[0]}!`);
    } else {
      showToast('error', '<i class="fa-solid fa-exclamation"></i>', result.error);
    }
  });
});
