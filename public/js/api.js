/* ─── Centralized API Client ──────────────────────────────────────────────── */
const api = (() => {
  const BASE_URL = '/api';

  function getToken() {
    const auth = localStorage.getItem('belaguest_auth');
    if (!auth) return null;
    try { return JSON.parse(auth).token; } catch { return null; }
  }

  async function request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(BASE_URL + path, options);
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || `HTTP ${res.status}`);
    }
    return data;
  }

  return {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    delete: (path) => request('DELETE', path),

    // Named methods for clarity
    login: (creds) => request('POST', '/auth/login', creds),
    register: (data) => request('POST', '/auth/register', data),
    getServicos: () => request('GET', '/servicos'),
    getProfissionais: () => request('GET', '/profissionais'),
    getProfissional: (id) => request('GET', `/profissionais/${id}`),
    createProfissional: (data) => request('POST', '/profissionais', data),
    updateProfissional: (id, data) => request('PUT', `/profissionais/${id}`, data),
    deleteProfissional: (id) => request('DELETE', `/profissionais/${id}`),
    getProfissionalServicos: (id) => request('GET', `/profissionais/${id}/servicos`),
    addProfissionalServico: (id, idServico) => request('POST', `/profissionais/${id}/servicos`, { idServico }),
    removeProfissionalServico: (id, sid) => request('DELETE', `/profissionais/${id}/servicos/${sid}`),
    getProfissionalHorarios: (id) => request('GET', `/profissionais/${id}/horarios`),
    addProfissionalHorario: (id, data) => request('POST', `/profissionais/${id}/horarios`, data),
    deleteProfissionalHorario: (id, hid) => request('DELETE', `/profissionais/${id}/horarios/${hid}`),
    getAgendamentos: (query = '') => request('GET', `/agendamentos${query}`),
    getMeusAgendamentos: () => request('GET', '/agendamentos/meus'),
    getDisponibilidade: (params) => request('GET', '/agendamentos/disponibilidade?' + new URLSearchParams(params)),
    createAgendamento: (data) => request('POST', '/agendamentos', data),
    updateAgendamento: (id, data) => request('PUT', `/agendamentos/${id}`, data),
    cancelAgendamento: (id) => request('DELETE', `/agendamentos/${id}`),
    getClientePerfil: () => request('GET', '/clientes/perfil'),
    updateClientePerfil: (data) => request('PUT', '/clientes/perfil', data),
    createServico: (data) => request('POST', '/servicos', data),
    updateServico: (id, data) => request('PUT', `/servicos/${id}`, data),
    deleteServico: (id) => request('DELETE', `/servicos/${id}`),
  };
})();
