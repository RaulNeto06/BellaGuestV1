/* ─── Funcionário Page Logic ─────────────────────────────────────────────── */
const funcPage = (() => {
  let auth, profissional = null, allServicos = [];
  let currentDate = todayStr();

  function init() {
    auth = app.requireAuth('funcionario');
    if (!auth) return;

    loadProfissional();
    loadAgendamentos();
    loadAllServicos();

    document.getElementById('hoje-date').textContent = formatDate(currentDate);
    document.getElementById('nav-date').value = currentDate;

    document.getElementById('btn-nav-date').addEventListener('click', () => {
      currentDate = document.getElementById('nav-date').value;
      loadAgendamentos();
    });

    document.getElementById('btn-add-horario').addEventListener('click', () => openModal('modal-horario'));
    document.getElementById('btn-save-horario').addEventListener('click', saveHorario);
    document.getElementById('btn-func-add-servico').addEventListener('click', addServico);
    document.getElementById('btn-save-obs').addEventListener('click', saveObs);
  }

  async function loadProfissional() {
    try {
      const res = await api.getProfissionais();
      // For demo, associate funcionario with first available professional
      // In a real system, the professional would be linked to the user account
      profissional = res.data.find(p => p.status === 'ativo') || res.data[0];
      if (profissional) {
        loadHorarios();
        loadServicos();
        loadPerfil();
      }
    } catch (e) { console.error(e); }
  }

  async function loadAgendamentos() {
    const list = document.getElementById('hoje-list');
    list.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';
    try {
      const params = new URLSearchParams({ data: currentDate });
      if (profissional) params.set('idProfissional', profissional.id);
      const res = await api.getAgendamentos('?' + params);
      renderAgendamentos(res.data);
    } catch (e) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${e.message}</p></div>`;
    }
  }

  function renderAgendamentos(list_data) {
    const list = document.getElementById('hoje-list');
    if (!list_data.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p>Nenhum agendamento para esta data</p></div>';
      return;
    }
    list.innerHTML = list_data.map(a => `
      <div class="agenda-card ${a.status} mb-1">
        <div class="agenda-time">${formatTime(a.horario)}</div>
        <div class="agenda-details">
          <div class="service">${a.nomeServico}</div>
          <div class="meta">👤 ${a.nomeCliente}</div>
          ${a.observacoes ? `<div class="meta">💬 ${a.observacoes}</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.35rem">
          ${statusBadge(a.status)}
          <div style="display:flex;gap:0.35rem">
            ${a.status !== 'concluido' && a.status !== 'cancelado'
              ? `<button class="btn btn-success btn-sm" onclick="funcPage.marcarConcluido(${a.id})">✔</button>` : ''}
            ${a.status !== 'cancelado'
              ? `<button class="btn btn-ghost btn-sm" onclick="funcPage.openObs(${a.id}, \`${(a.observacoes||'').replace(/`/g,"'")}\`)">📝</button>` : ''}
            ${['pendente','confirmado'].includes(a.status)
              ? `<button class="btn btn-danger btn-sm" onclick="funcPage.cancelar(${a.id})">✕</button>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  async function marcarConcluido(id) {
    try {
      await api.updateAgendamento(id, { status: 'concluido' });
      showToast('Marcado como concluído', 'success');
      loadAgendamentos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function cancelar(id) {
    if (!confirm('Cancelar este agendamento?')) return;
    try {
      await api.cancelAgendamento(id);
      showToast('Cancelado', 'warning');
      loadAgendamentos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  function openObs(id, obs) {
    document.getElementById('obs-agenda-id').value = id;
    document.getElementById('obs-text').value = obs;
    openModal('modal-obs');
  }

  async function saveObs() {
    const id = document.getElementById('obs-agenda-id').value;
    const obs = document.getElementById('obs-text').value;
    try {
      await api.updateAgendamento(id, { status: 'confirmado', observacoes: obs });
      showToast('Observação salva', 'success');
      closeModal('modal-obs');
      loadAgendamentos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function loadHorarios() {
    if (!profissional) return;
    const el = document.getElementById('horarios-list');
    el.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';
    try {
      const res = await api.getProfissionalHorarios(profissional.id);
      if (!res.data.length) {
        el.innerHTML = '<div class="text-muted">Nenhum horário cadastrado</div>';
        return;
      }
      el.innerHTML = res.data.map(h => `
        <div class="agenda-card mb-1" style="border-left-color:var(--primary)">
          <div style="flex:1">
            <strong>${DIAS_SEMANA_FULL[h.diaSemana]}</strong>
            <span class="text-muted" style="margin-left:1rem">${formatTime(h.horarioInicio)} – ${formatTime(h.horarioFim)}</span>
          </div>
          <button class="btn btn-danger btn-sm" onclick="funcPage.deleteHorario(${h.id})">✕</button>
        </div>
      `).join('');
    } catch (e) { el.innerHTML = `<div class="text-muted">${e.message}</div>`; }
  }

  async function saveHorario() {
    if (!profissional) return;
    const dia = parseInt(document.getElementById('h-dia').value);
    const inicio = document.getElementById('h-inicio').value;
    const fim = document.getElementById('h-fim').value;
    try {
      await api.addProfissionalHorario(profissional.id, { diaSemana: dia, horarioInicio: inicio + ':00', horarioFim: fim + ':00' });
      showToast('Horário adicionado', 'success');
      closeModal('modal-horario');
      loadHorarios();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function deleteHorario(id) {
    if (!profissional) return;
    try {
      await api.deleteProfissionalHorario(profissional.id, id);
      showToast('Horário removido', 'warning');
      loadHorarios();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function loadAllServicos() {
    try {
      const res = await api.getServicos();
      allServicos = res.data;
      const sel = document.getElementById('func-add-servico');
      allServicos.forEach(s => sel.insertAdjacentHTML('beforeend', `<option value="${s.id}">${s.nome}</option>`));
    } catch (e) { console.error(e); }
  }

  async function loadServicos() {
    if (!profissional) return;
    const el = document.getElementById('func-servicos-list');
    try {
      const res = await api.getProfissionalServicos(profissional.id);
      if (!res.data.length) {
        el.innerHTML = '<div class="text-muted">Nenhum serviço cadastrado</div>';
        return;
      }
      el.innerHTML = `<div class="slots-grid">` +
        res.data.map(s => `
          <div class="slot available" style="cursor:default;display:flex;justify-content:space-between;align-items:center">
            <span>${s.nome}</span>
            <button class="btn btn-ghost btn-sm" onclick="funcPage.removeServico(${s.id})" style="padding:0;line-height:1">✕</button>
          </div>
        `).join('') + `</div>`;
    } catch (e) { el.innerHTML = `<div class="text-muted">${e.message}</div>`; }
  }

  async function addServico() {
    if (!profissional) return;
    const id = document.getElementById('func-add-servico').value;
    if (!id) return;
    try {
      await api.addProfissionalServico(profissional.id, id);
      showToast('Serviço adicionado', 'success');
      loadServicos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function removeServico(sid) {
    if (!profissional) return;
    try {
      await api.removeProfissionalServico(profissional.id, sid);
      showToast('Serviço removido', 'warning');
      loadServicos();
    } catch (e) { showToast(e.message, 'error'); }
  }

  function loadPerfil() {
    if (!profissional) return;
    document.getElementById('perfil-nome').value = profissional.nome || '';
    document.getElementById('perfil-especialidade').value = profissional.especialidade || '';
    document.getElementById('perfil-telefone').value = profissional.telefone || '';

    document.getElementById('btn-save-perfil').addEventListener('click', async () => {
      const nome = document.getElementById('perfil-nome').value.trim();
      const especialidade = document.getElementById('perfil-especialidade').value.trim();
      const telefone = document.getElementById('perfil-telefone').value.trim();
      try {
        await api.updateProfissional(profissional.id, { nome, especialidade, telefone });
        showToast('Perfil atualizado!', 'success');
        document.getElementById('header-nome').textContent = nome;
        profissional.nome = nome;
      } catch (e) { showToast(e.message, 'error'); }
    });
  }

  return { init, loadAgendamentos, marcarConcluido, cancelar, openObs, deleteHorario, removeServico };
})();

document.addEventListener('DOMContentLoaded', funcPage.init);
