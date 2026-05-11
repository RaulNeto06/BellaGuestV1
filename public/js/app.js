/* ─── App: Auth + Routing + Shared Utilities ─────────────────────────────── */
const app = (() => {
  const STORAGE_KEY = 'belaguest_auth';

  function setAuth(token, usuario) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, usuario }));
  }

  function getAuth() {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    try { return JSON.parse(item); } catch { return null; }
  }

  function clearAuth() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function redirectByRole(role) {
    const map = { cliente: '/cliente', funcionario: '/funcionario', administrador: '/admin' };
    window.location.href = map[role] || '/';
  }

  function requireAuth(requiredRole) {
    const auth = getAuth();
    if (!auth) { window.location.href = '/'; return null; }
    if (requiredRole && auth.usuario.tipoUsuario !== requiredRole) {
      redirectByRole(auth.usuario.tipoUsuario);
      return null;
    }
    return auth;
  }

  return { setAuth, getAuth, clearAuth, redirectByRole, requireAuth };
})();

/* ─── Toast Notifications ────────────────────────────────────────────────── */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fadeout');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ─── Modal Helpers ──────────────────────────────────────────────────────── */
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

/* ─── Sidebar Navigation ─────────────────────────────────────────────────── */
function initSidebar() {
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.dataset.section;
      document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
      item.classList.add('active');
      const el = document.getElementById(`section-${section}`);
      if (el) el.classList.add('active');
    });
  });
}

/* ─── Shared init ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      app.clearAuth();
      window.location.href = '/';
    });
  }

  const auth = app.getAuth();
  const headerNome = document.getElementById('header-nome');
  if (headerNome && auth) headerNome.textContent = auth.usuario.nome;
});

/* ─── Date Helpers ───────────────────────────────────────────────────────── */
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  return timeStr.substring(0, 5);
}

function formatCurrency(val) {
  return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DIAS_SEMANA_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

function statusBadge(status) {
  return `<span class="badge badge-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}
