/* ─── Cliente Page Logic ─────────────────────────────────────────────────── */
const clientePage = (() => {
  let auth, calendar, servicos = [], profissionais = [];
  let bookingData = {};

  function init() {
    auth = app.requireAuth('cliente');
    if (!auth) return;

    loadFilters();
    initCalendar();
    loadMeus();
    loadPerfil();
    initTabs();

    document.getElementById('close-modal-booking').addEventListener('click', () => closeModal('modal-booking'));
    document.getElementById('close-modal-booking2').addEventListener('click', () => closeModal('modal-booking'));
    document.getElementById('btn-confirm-booking').addEventListener('click', confirmBooking);
  }

  async function loadFilters() {
    try {
      const [rs, rp] = await Promise.all([api.getServicos(), api.getProfissionais()]);
      servicos = rs.data;
      profissionais = rp.data;

      const selS = document.getElementById('filter-servico');
      const selP = document.getElementById('filter-profissional');
      servicos.forEach(s => selS.insertAdjacentHTML('beforeend', `<option value="${s.id}">${s.nome}</option>`));
      profissionais.forEach(p => selP.insertAdjacentHTML('beforeend', `<option value="${p.id}">${p.nome}</option>`));

      selS.addEventListener('change', () => { if (calendar?.selected) loadSlots(calendar.selected); });
      selP.addEventListener('change', () => { if (calendar?.selected) loadSlots(calendar.selected); });
    } catch (e) { console.error(e); }
  }

  function initCalendar() {
    calendar = new Calendar('calendar-cliente', {
      onDayClick: (date) => loadSlots(date),
    });
  }

  async function loadSlots(date) {
    const idServico = document.getElementById('filter-servico').value;
    const idProfissional = document.getElementById('filter-profissional').value;

    document.getElementById('slots-title').textContent = `Horários – ${formatDate(date)}`;
    const body = document.getElementById('slots-body');
    body.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';

    try {
      const params = { data: date };
      if (idServico) params.idServico = idServico;
      if (idProfissional) params.idProfissional = idProfissional;

      const res = await api.getDisponibilidade(params);
      const data_list = res.data;

      if (!data_list.length) {
        body.innerHTML = '<div class="empty-state"><div class="empty-icon">😔</div><p>Sem profissionais disponíveis nesta data</p></div>';
        return;
      }

      let html = '';
      for (const item of data_list) {
        const availableSlots = item.slots.filter(s => s.disponivel);
        if (!availableSlots.length) continue;
        const serviceName = idServico ? (servicos.find(s => s.id == idServico)?.nome || 'Serviço') : item.servicos.map(s => s.nome).join(', ');

        html += `<div class="mb-2">
          <div style="font-weight:600;margin-bottom:0.5rem;color:var(--gray-700)">
            👤 ${item.profissional.nome}
            <span style="font-weight:400;font-size:0.8rem;color:var(--gray-500)"> – ${item.profissional.especialidade || ''}</span>
          </div>
          <div class="slots-grid">`;
        item.slots.forEach(slot => {
          const cls = slot.disponivel ? 'available' : 'occupied';
          html += `<div class="slot ${cls}" 
            data-date="${date}" data-horario="${slot.horario}"
            data-profissional="${item.profissional.id}" data-profissional-nome="${item.profissional.nome}"
            data-servico="${idServico || (item.servicos[0]?.id || '')}"
            data-servico-nome="${idServico ? (servicos.find(s => s.id == idServico)?.nome || '') : (item.servicos[0]?.nome || '')}"
            ${slot.disponivel ? '' : 'title="Horário ocupado"'}>
            ${formatTime(slot.horario)}
          </div>`;
        });
        html += `</div></div>`;
      }

      if (!html) {
        body.innerHTML = '<div class="empty-state"><div class="empty-icon">😔</div><p>Todos os horários estão ocupados</p></div>';
        return;
      }
      body.innerHTML = html;

      body.querySelectorAll('.slot.available').forEach(slot => {
        slot.addEventListener('click', () => openBooking(slot.dataset));
      });
    } catch (e) {
      body.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${e.message}</p></div>`;
    }
  }

  function openBooking(data) {
    bookingData = data;
    document.getElementById('bk-data').textContent = formatDate(data.date);
    document.getElementById('bk-horario').textContent = formatTime(data.horario);
    document.getElementById('bk-profissional').textContent = data.profissionalNome;
    document.getElementById('bk-servico').textContent = data.servicoNome;
    document.getElementById('bk-obs').value = '';
    openModal('modal-booking');
  }

  async function confirmBooking() {
    const obs = document.getElementById('bk-obs').value;
    const btn = document.getElementById('btn-confirm-booking');
    btn.disabled = true; btn.textContent = 'Agendando…';
    try {
      await api.createAgendamento({
        data: bookingData.date,
        horario: bookingData.horario,
        idServico: bookingData.servico,
        idProfissional: bookingData.profissional,
        observacoes: obs,
      });
      closeModal('modal-booking');
      showToast('Agendamento realizado com sucesso! 🎉', 'success');
      loadSlots(bookingData.date);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      btn.disabled = false; btn.textContent = 'Confirmar Agendamento';
    }
  }

  async function loadMeus() {
    const list = document.getElementById('meus-list');
    list.innerHTML = '<div class="loading-overlay"><div class="spinner"></div></div>';
    try {
      const res = await api.getMeusAgendamentos();
      renderMeus(res.data);
    } catch (e) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>${e.message}</p></div>`;
    }
  }

  function renderMeus(agendamentos, filter = 'todos') {
    const list = document.getElementById('meus-list');
    let items = filter === 'todos' ? agendamentos : agendamentos.filter(a => a.status === filter);

    if (!items.length) {
      list.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p>Nenhum agendamento encontrado</p></div>';
      return;
    }

    list.innerHTML = items.map(a => `
      <div class="agenda-card ${a.status} mb-1">
        <div class="agenda-time">${formatTime(a.horario)}</div>
        <div class="agenda-details">
          <div class="service">${a.nomeServico}</div>
          <div class="meta">📅 ${formatDate(a.data)} • 👤 ${a.nomeProfissional} • ${formatCurrency(a.preco)}</div>
          ${a.observacoes ? `<div class="meta" style="margin-top:2px">💬 ${a.observacoes}</div>` : ''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.35rem">
          ${statusBadge(a.status)}
          ${['pendente','confirmado'].includes(a.status)
            ? `<button class="btn btn-danger btn-sm" onclick="clientePage.cancelar(${a.id})">Cancelar</button>` : ''}
        </div>
      </div>
    `).join('');

    // Store for re-filtering
    list.dataset.rawJson = JSON.stringify(agendamentos);
  }

  async function cancelar(id) {
    if (!confirm('Deseja cancelar este agendamento?')) return;
    try {
      await api.cancelAgendamento(id);
      showToast('Agendamento cancelado', 'warning');
      loadMeus();
    } catch (e) { showToast(e.message, 'error'); }
  }

  function initTabs() {
    document.querySelectorAll('[data-tab-filter]').forEach(btn => {
      btn.addEventListener('click', async () => {
        document.querySelectorAll('[data-tab-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const list = document.getElementById('meus-list');
        const raw = list.dataset.rawJson;
        if (raw) {
          renderMeus(JSON.parse(raw), btn.dataset.tabFilter);
        } else {
          await loadMeus();
        }
      });
    });
  }

  async function loadPerfil() {
    try {
      const res = await api.getClientePerfil();
      document.getElementById('perfil-nome').value = res.data.nome || '';
      document.getElementById('perfil-email').value = res.data.email || '';
      document.getElementById('perfil-telefone').value = res.data.telefone || '';
    } catch (e) { console.error(e); }

    document.getElementById('btn-save-perfil').addEventListener('click', async () => {
      const nome = document.getElementById('perfil-nome').value.trim();
      const telefone = document.getElementById('perfil-telefone').value.trim();
      try {
        await api.updateClientePerfil({ nome, telefone });
        showToast('Perfil atualizado!', 'success');
        document.getElementById('header-nome').textContent = nome;
      } catch (e) { showToast(e.message, 'error'); }
    });
  }

  return { init, loadMeus, cancelar };
})();

document.addEventListener('DOMContentLoaded', clientePage.init);
