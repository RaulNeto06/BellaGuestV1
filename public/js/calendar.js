/* ─── Reusable Calendar Component ───────────────────────────────────────── */
class Calendar {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = { onDayClick: null, marks: {}, minDate: null, ...options };
    this.current = new Date();
    this.current.setDate(1);
    this.selected = null;
    this.render();
  }

  setMarks(marks) {
    this.marks = marks;
    this.render();
  }

  setOnDayClick(fn) { this.options.onDayClick = fn; }

  render() {
    if (!this.container) return;
    const year = this.current.getFullYear();
    const month = this.current.getMonth();
    const now = new Date();

    const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                        'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `
      <div class="calendar-wrapper">
        <div class="calendar-header">
          <button class="btn btn-ghost btn-sm" id="cal-prev" style="color:white;padding:0.3rem 0.6rem">◀</button>
          <h3>${monthNames[month]} ${year}</h3>
          <button class="btn btn-ghost btn-sm" id="cal-next" style="color:white;padding:0.3rem 0.6rem">▶</button>
        </div>
        <div class="calendar-grid">
    `;

    ['D','S','T','Q','Q','S','S'].forEach(d => {
      html += `<div class="calendar-day-label">${d}</div>`;
    });

    for (let i = 0; i < firstDay; i++) html += `<div class="calendar-day empty"></div>`;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const dayDate = new Date(year, month, day);
      const isToday = dayDate.toDateString() === now.toDateString();
      const isPast = dayDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const isSelected = this.selected === dateStr;

      let classes = 'calendar-day';
      if (isToday) classes += ' today';
      if (isPast) classes += ' past';
      if (isSelected) classes += ' selected';

      const dayMarks = this.marks && this.marks[dateStr] || [];
      const dots = dayMarks.map(m => `<div class="dot dot-${m}"></div>`).join('');

      html += `<div class="${classes}" data-date="${dateStr}">
        <span class="day-num">${day}</span>
        <div class="day-dots">${dots}</div>
      </div>`;
    }

    html += `</div></div>`;
    this.container.innerHTML = html;

    document.getElementById('cal-prev').addEventListener('click', () => {
      this.current.setMonth(this.current.getMonth() - 1);
      this.render();
    });
    document.getElementById('cal-next').addEventListener('click', () => {
      this.current.setMonth(this.current.getMonth() + 1);
      this.render();
    });

    this.container.querySelectorAll('.calendar-day:not(.empty):not(.past)').forEach(cell => {
      cell.addEventListener('click', () => {
        const date = cell.dataset.date;
        this.selected = date;
        this.render();
        if (this.options.onDayClick) this.options.onDayClick(date);
      });
    });
  }
}
