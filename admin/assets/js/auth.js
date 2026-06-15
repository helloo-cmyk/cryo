// Protect Admin Routes
document.addEventListener("DOMContentLoaded", () => {
  // Check if current path includes 'login' (handles both /login and /admin/login.html)
  const isLoginPage = window.location.pathname.includes('login');

  supabaseClient.auth.onAuthStateChange((event, session) => {
    const user = session?.user;
    if (user) {
      // User is logged in
      if (isLoginPage) {
        // Redirect to dashboard if trying to access login page while authenticated
        window.location.href = '/admin/dashboard';
      } else {
        // Set up logout button functionality on protected pages
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', async () => {
            await supabaseClient.auth.signOut();
            window.location.href = '/login';
          });
        }
      }
    } else {
      // User is NOT logged in
      if (!isLoginPage) {
        // Redirect to login if trying to access a protected page
        window.location.href = '/login';
      } else {
        // Handle login logic on the login page
        const loginForm = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const errorMsg = document.getElementById('error-msg');
        const loginBtn = document.getElementById('login-btn');

        if (loginForm) {
          loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
              errorMsg.textContent = 'Please enter both email and password.';
              errorMsg.style.display = 'block';
              return;
            }

            loginBtn.textContent = 'Logging in...';
            loginBtn.disabled = true;

            const { data, error } = await supabaseClient.auth.signInWithPassword({
              email: email,
              password: password,
            });

            if (error) {
              loginBtn.textContent = 'Login';
              loginBtn.disabled = false;
              errorMsg.style.display = 'block';
              errorMsg.textContent = error.message || 'Invalid credentials. Please try again.';
            }
          });
        }
      }
    }
  });
});
