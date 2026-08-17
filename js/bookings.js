/* ===========================
   BOOKINGS.JS — Calendar & Form
=========================== */

// ─── CALENDAR ───
(function() {
  const monthTitle = document.getElementById('cal-month-title');
  const daysContainer = document.getElementById('cal-days');
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  const dateInput = document.getElementById('booking-date');

  if (!monthTitle || !daysContainer) return;

  let now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth();

  // Pre-seeded booked dates (day numbers for current displayed month)
  const BOOKED_DAYS = {
    // Key: "YYYY-M" → array of day numbers
  };

  // Generate random booked days for next 3 months
  for (let m = 0; m < 3; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() + m, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const days = new Set();
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    while (days.size < Math.floor(daysInMonth * 0.3)) {
      days.add(Math.floor(Math.random() * daysInMonth) + 1);
    }
    BOOKED_DAYS[key] = [...days];
  }

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  let selectedDate = null;

  function renderCalendar() {
    monthTitle.textContent = `${MONTHS[viewMonth]} ${viewYear}`;
    daysContainer.innerHTML = '';

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const key = `${viewYear}-${viewMonth}`;
    const bookedDays = BOOKED_DAYS[key] || [];
    const todayDate = new Date();

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day empty';
      daysContainer.appendChild(el);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(viewYear, viewMonth, d);
      const isPast = cellDate < new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
      const isToday = cellDate.toDateString() === todayDate.toDateString();
      const isBooked = bookedDays.includes(d);
      const isSelected = selectedDate && cellDate.toDateString() === selectedDate.toDateString();

      const el = document.createElement('div');
      let cls = 'cal-day';
      if (isPast) cls += ' booked'; // treat past as unavailable
      else if (isBooked) cls += ' booked';
      else cls += ' available';
      if (isToday) cls += ' today';
      if (isSelected) cls += ' selected';
      el.className = cls;
      el.textContent = d;

      // Tooltip
      const tip = document.createElement('span');
      tip.className = 'cal-tooltip';
      tip.textContent = isPast ? 'Past date' : isBooked ? 'Fully booked' : isToday ? 'Today — available!' : 'Available';
      el.appendChild(tip);

      if (!isPast && !isBooked) {
        el.addEventListener('click', () => {
          // Deselect previous
          document.querySelector('.cal-day.selected')?.classList.remove('selected');
          el.classList.add('selected');
          selectedDate = cellDate;
          if (dateInput) {
            dateInput.value = cellDate.toLocaleDateString('en-GB', {
              day: '2-digit', month: 'long', year: 'numeric'
            });
          }
        });
      }

      daysContainer.appendChild(el);
    }
  }

  prevBtn?.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });

  nextBtn?.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  renderCalendar();
})();

// ─── BOOKING FORM ───
document.getElementById('booking-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const success = document.querySelector('.booking-success');
  if (success) {
    success.classList.add('show');
    this.style.display = 'none';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
