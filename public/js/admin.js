/* ─── Admin Page Logic ───────────────────────────────────────────────────── */
function escapeBacktick(str) { return (str || '').replace(/`/g, "'"); }

const adminPage = (() => {
  let auth, agendamentos = [], profissionais = [], servicos = [];

  function init() {
    auth = app.requireAuth('administrador');
    if (!auth) return;

    document.getElementById('dash-date').textContent = formatDate(todayStr());
    loadDashboard();
    loadProfissionais();
    loadServicos();
    initAgendamentosFilters();

    document.getElementById('btn-new-prof').addEventListener('click', openNewProf);
    document.getElementById('btn-save-prof').addEventListener('click', saveProf);
    document.getElementById('btn-new-serv').addEventListener('click', openNewServ);
    document.getElementById('btn-save-serv').addEventListener('click', saveServ);
    document.getElementById('btn-save-ag-status').addEventListener('click', saveAgStatus);
  }

  /* ── Dashboard ── */
  async function loadDashboard() {
    const el = document.getElementById('dash-agenda-list');
    el.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';
    try {
      const res = await api.getAgendamentos(`?data=${todayStr()}`);
      const data = res.data;

      const counts = { pendente: 0, confirmado: 0, concluido: 0, cancelado: 0 };
      data.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });

      document.getElementById('stat-total').textContent = data.length;
      document.getElementById('stat-pendente').textContent = counts.pendente;
      document.getElementById('stat-confirmado').textContent = counts.confirmado;
      document.getElementById('stat-concluido').textContent = counts.concluido;
      document.getElementById('stat-cancelado').textContent = counts.cancelado;

      if (!data.length) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p>Nenhum agendamento hoje</p></div>';
        return;
      }
      el.innerHTML = data.map(a => `
        <div class="agenda-card ${a.status} mb-1">
          <div class="agenda-time">${formatTime(a.horario)}</div>
          <div class="agenda-details">
            <div class="service">${a.nomeServico}</div>
            <div class="meta">👤 ${a.nomeCliente} • 💼 ${a.nomeProfissional}</div>
          </div>
          ${statusBadge(a.status)}
        </div>
      `).join('');
    } catch (e) {
      el.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${e.message}</p></div>`;
    }
  }

  /* ── Agendamentos ── */
  function initAgendamentosFilters() {
    document.getElementById('btn-ag-filter').addEventListener('click', loadAgendamentos);
  }

  async function loadAgendamentos() {
    const params = new URLSearchParams();
    const start = document.getElementById('ag-start').value;
    const end = document.getElementById('ag-end').value;
    const prof = document.getElementById('ag-prof').value;
    const status = document.getElementById('ag-status').value;
    if (start) params.set('startDate', start);
    if (end) params.set('endDate', end);
    if (prof) params.set('idProfissional', prof);
    if (status) params.set('status', status);

    const tbody = document.getElementById('ag-tbody');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem"><div class="spinner" style="margin:auto"></div></td></tr>';
    try {
      const res = await api.getAgendamentos(params.toString() ? '?' + params : '');
      agendamentos = res.data;
      renderAgendamentosTable(agendamentos);
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center">${e.message}</td></tr>`;
    }
  }

  function renderAgendamentosTable(data) {
    const tbody = document.getElementById('ag-tbody');
    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray-400)">Nenhum agendamento encontrado</td></tr>';
      return;
    }
    tbody.innerHTML = data.map(a => `
      <tr>
        <td>${formatDate(a.data)}</td>
        <td>${formatTime(a.horario)}</td>
        <td>${a.nomeCliente}</td>
        <td>${a.nomeServico}</td>
        <td>${a.nomeProfissional}</td>
        <td>${statusBadge(a.status)}</td>
        <td>
          <button class="btn btn-ghost btn-sm" onclick="adminPage.openAgStatus(${a.id}, '${a.status}', \`${escapeBacktick(a.observacoes)}\`)">✏️</button>
          ${['pendente','confirmado'].includes(a.status)
            ? `<button class="btn btn-danger btn-sm" onclick="adminPage.cancelarAg(${a.id})">✕</button>` : ''}
        </td>
      </tr>
    `).join('');
  }

  function openAgStatus(id, status, obs) {
    document.getElementById('ag-status-id').value = id;
    document.getElementById('ag-new-status').value = status;
    document.getElementById('ag-obs').value = obs;
    openModal('modal-ag-status');
  }

  async function saveAgStatus() {
    const id = document.getElementById('ag-status-id').value;
    const status = document.getElementById('ag-new-status').value;
    const obs = document.getElementById('ag-obs').value;
    try {
      await api.updateAgendamento(id, { status, observacoes: obs });
      showToast('Agendamento atualizado', 'success');
      closeModal('modal-ag-status');
      loadAgendamentos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function cancelarAg(id) {
    if (!confirm('Cancelar este agendamento?')) return;
    try {
      await api.cancelAgendamento(id);
      showToast('Cancelado', 'warning');
      loadAgendamentos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  /* ── Profissionais ── */
  async function loadProfissionais() {
    const tbody = document.getElementById('prof-tbody');
    try {
      const res = await api.getProfissionais();
      profissionais = res.data;

      // Populate ag-prof filter
      const agProf = document.getElementById('ag-prof');
      agProf.innerHTML = '<option value="">Todos</option>';
      profissionais.forEach(p => agProf.insertAdjacentHTML('beforeend', `<option value="${p.id}">${p.nome}</option>`));

      if (!profissionais.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--gray-400)">Nenhum profissional</td></tr>';
        return;
      }
      tbody.innerHTML = profissionais.map(p => `
        <tr>
          <td><strong>${p.nome}</strong></td>
          <td>${p.especialidade || '–'}</td>
          <td>${p.telefone || '–'}</td>
          <td>${statusBadge(p.status)}</td>
          <td>
            <button class="btn btn-ghost btn-sm" onclick="adminPage.editProf(${p.id})">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="adminPage.deleteProf(${p.id})">🗑️</button>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="5">${e.message}</td></tr>`;
    }
  }

  function openNewProf() {
    document.getElementById('prof-modal-title').textContent = 'Novo Profissional';
    document.getElementById('prof-id').value = '';
    document.getElementById('prof-nome').value = '';
    document.getElementById('prof-especialidade').value = '';
    document.getElementById('prof-telefone').value = '';
    document.getElementById('prof-status').value = 'ativo';
    openModal('modal-prof');
  }

  function editProf(id) {
    const p = profissionais.find(x => x.id === id);
    if (!p) return;
    document.getElementById('prof-modal-title').textContent = 'Editar Profissional';
    document.getElementById('prof-id').value = p.id;
    document.getElementById('prof-nome').value = p.nome;
    document.getElementById('prof-especialidade').value = p.especialidade || '';
    document.getElementById('prof-telefone').value = p.telefone || '';
    document.getElementById('prof-status').value = p.status;
    openModal('modal-prof');
  }

  async function saveProf() {
    const id = document.getElementById('prof-id').value;
    const data = {
      nome: document.getElementById('prof-nome').value.trim(),
      especialidade: document.getElementById('prof-especialidade').value.trim(),
      telefone: document.getElementById('prof-telefone').value.trim(),
      status: document.getElementById('prof-status').value,
    };
    if (!data.nome) { showToast('Nome é obrigatório', 'error'); return; }
    try {
      if (id) await api.updateProfissional(id, data);
      else await api.createProfissional(data);
      showToast(id ? 'Profissional atualizado' : 'Profissional criado', 'success');
      closeModal('modal-prof');
      loadProfissionais();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function deleteProf(id) {
    if (!confirm('Remover este profissional? Esta ação não pode ser desfeita.')) return;
    try {
      await api.deleteProfissional(id);
      showToast('Profissional removido', 'warning');
      loadProfissionais();
    } catch (e) { showToast(e.message, 'error'); }
  }

  /* ── Serviços ── */
  async function loadServicos() {
    const tbody = document.getElementById('serv-tbody');
    try {
      const res = await api.getServicos();
      servicos = res.data;
      if (!servicos.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--gray-400)">Nenhum serviço</td></tr>';
        return;
      }
      tbody.innerHTML = servicos.map(s => `
        <tr>
          <td><strong>${s.nome}</strong></td>
          <td>${s.duracaoMinutos} min</td>
          <td>${formatCurrency(s.preco)}</td>
          <td><span style="font-size:0.85rem;color:var(--gray-600)">${s.descricao || '–'}</span></td>
          <td>
            <button class="btn btn-ghost btn-sm" onclick="adminPage.editServ(${s.id})">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="adminPage.deleteServ(${s.id})">🗑️</button>
          </td>
        </tr>
      `).join('');
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="5">${e.message}</td></tr>`;
    }
  }

  function openNewServ() {
    document.getElementById('serv-modal-title').textContent = 'Novo Serviço';
    document.getElementById('serv-id').value = '';
    document.getElementById('serv-nome').value = '';
    document.getElementById('serv-desc').value = '';
    document.getElementById('serv-duracao').value = '60';
    document.getElementById('serv-preco').value = '';
    openModal('modal-serv');
  }

  function editServ(id) {
    const s = servicos.find(x => x.id === id);
    if (!s) return;
    document.getElementById('serv-modal-title').textContent = 'Editar Serviço';
    document.getElementById('serv-id').value = s.id;
    document.getElementById('serv-nome').value = s.nome;
    document.getElementById('serv-desc').value = s.descricao || '';
    document.getElementById('serv-duracao').value = s.duracaoMinutos;
    document.getElementById('serv-preco').value = s.preco;
    openModal('modal-serv');
  }

  async function saveServ() {
    const id = document.getElementById('serv-id').value;
    const data = {
      nome: document.getElementById('serv-nome').value.trim(),
      descricao: document.getElementById('serv-desc').value.trim(),
      duracaoMinutos: parseInt(document.getElementById('serv-duracao').value),
      preco: parseFloat(document.getElementById('serv-preco').value),
    };
    if (!data.nome) { showToast('Nome é obrigatório', 'error'); return; }
    if (isNaN(data.preco)) { showToast('Preço inválido', 'error'); return; }
    try {
      if (id) await api.updateServico(id, data);
      else await api.createServico(data);
      showToast(id ? 'Serviço atualizado' : 'Serviço criado', 'success');
      closeModal('modal-serv');
      loadServicos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function deleteServ(id) {
    if (!confirm('Remover este serviço?')) return;
    try {
      await api.deleteServico(id);
      showToast('Serviço removido', 'warning');
      loadServicos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  return {
    init, loadDashboard, loadAgendamentos,
    openAgStatus, cancelarAg,
    editProf, deleteProf,
    editServ, deleteServ,
  };
})();

document.addEventListener('DOMContentLoaded', adminPage.init);
