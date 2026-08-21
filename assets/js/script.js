/* ===== N&N Motors — shared site scripts ===== */

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 3000);
}
function handleFormSubmit(e, msg){ e.preventDefault(); showToast(msg); e.target.reset(); }

/* ---------- Wishlist toggle ---------- */
function toggleWishlist(btn, name){
  btn.classList.toggle('active');
  if(btn.classList.contains('active')){ btn.innerHTML='<i class="fa-solid fa-heart"></i>'; showToast(name+' added to wishlist'); }
  else { btn.innerHTML='<i class="fa-regular fa-heart"></i>'; }
}

/* ---------- Enquiry modal ---------- */
function ensureEnquireModal(){
  if(document.getElementById('enquireOverlay')) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="enquire-overlay" id="enquireOverlay">
      <div class="enquire-modal">
        <div class="enquire-bar">
          <span>Request More Information</span>
          <button type="button" id="enquireCloseTop" aria-label="Close window">Close Window <i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="enquire-body">
          <p class="enquire-intro">Use the form below to request more information about this listing.</p>
          <p class="enquire-required">Required fields are indicated by an asterisk (*)</p>
          <form id="enquireForm">
            <div class="form-field"><label>Name: *</label><input type="text" id="enqName" required></div>
            <div class="form-field"><label>Email Address: *</label><input type="email" id="enqEmail" required></div>
            <div class="form-field"><label>Phone Number:</label><input type="tel" id="enqPhone"></div>
            <div class="form-field"><label>Subject: *</label><input type="text" id="enqSubject" required></div>
            <div class="form-field"><label>Message: *</label><textarea id="enqMessage" rows="5" required></textarea></div>
            <div class="form-field"><label>Best time to reach me:</label>
              <select id="enqTime"><option>Any Time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select>
            </div>
            <button type="submit" class="btn btn-primary">Send</button>
          </form>
        </div>
        <div class="enquire-bar">
          <span>&nbsp;</span>
          <button type="button" id="enquireCloseBottom" aria-label="Close window">Close Window <i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(wrap.firstElementChild);

  const overlay = document.getElementById('enquireOverlay');
  const closeModal = () => overlay.classList.remove('open');
  document.getElementById('enquireCloseTop').addEventListener('click', closeModal);
  document.getElementById('enquireCloseBottom').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });
  document.getElementById('enquireForm').addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    showToast("Thanks — your enquiry has been sent. We'll be in touch shortly.");
    e.target.reset();
  });
}
function openEnquireModal(vehicleId){
  ensureEnquireModal();
  let title = 'this vehicle';
  if(typeof getVehicleById === 'function'){
    const v = getVehicleById(vehicleId);
    if(v) title = `${v.year} ${v.make} ${v.model}${v.trim ? ' ' + v.trim : ''}`;
  }
  document.getElementById('enqSubject').value = title;
  document.getElementById('enqMessage').value = `I would like to receive additional information about the ${title} displayed on your website.`;
  document.getElementById('enquireOverlay').classList.add('open');
}

/* ---------- Info modal: Buyer's Guide / Finance / Trade-In rules & T&Cs ---------- */
const INFO_CONTENT = {
  'buyers-guide': {
    title: "Buyer's Guide",
    subtitle: "What to check before buying a used car",
    sections: [
      { heading: 'Before You Buy', body: [
        'Compare the odometer reading against the vehicle\'s age and check for a full service history where available.',
        'Inspect tyre tread, the spare wheel, and look for uneven wear that can point to alignment or suspension issues.',
        'Check for warning lights on the dash, and test the air conditioning, electric windows and central locking.',
        'Look along the body panels in good light for uneven gaps or mismatched paint, which can indicate prior accident repair.',
        'Take the vehicle for a proper test drive — listen for unusual noises under acceleration, braking and cornering.'
      ]},
      { heading: 'Our Inspection Standard', body: [
        'Every vehicle on our floor is checked over before it is listed for sale, covering basic mechanical condition and fluid levels.',
        'This is a dealer inspection for general condition — it is not a substitute for an independent roadworthy inspection, and we\'re happy to arrange one on request.'
      ]},
      { heading: 'Terms & Conditions', body: [
        'Vehicles are sold voetstoots (as-is) unless a specific condition is agreed to in writing on your invoice.',
        'No warranty is implied beyond what is explicitly stated in writing at the time of sale.',
        'Valid FICA documentation (ID and proof of residence) is required before any sale can be concluded.',
        'A deposit reserves a vehicle for a limited period and is generally non-refundable once paid, except where required by the Consumer Protection Act.',
        'Ownership and registration are only transferred once full payment has been received and has cleared in our account.'
      ]}
    ],
    cta: { label: 'Browse Vehicles', href: 'vehicles.html' }
  },
  'finance': {
    title: 'Vehicle Finance',
    subtitle: 'How it works, what you need, and the terms',
    sections: [
      { heading: 'How We Help', body: [
        'N&N Motors acts as an intermediary and submits your application to our finance partners — ABSA, WesBank, Standard Bank and Nedbank MFC.',
        'We do not provide finance directly, and we do not charge you for submitting an application on your behalf.'
      ]},
      { heading: 'What You\'ll Need', body: [
        'A valid RSA ID or passport.',
        'Proof of residence not older than three months.',
        'Your latest three months\' bank statements.',
        'Proof of income, such as a recent payslip.',
        'FICA compliance is mandatory before any application can be submitted to a bank.'
      ]},
      { heading: 'Approval & Rates', body: [
        'Final approval and interest rate are entirely at the discretion of the relevant bank, based on your credit profile and affordability.',
        'Figures shown on this website, including the repayment calculator, are estimates only and do not constitute a loan offer.',
        'Pre-approval is an indication, not a guarantee of final approval.'
      ]},
      { heading: 'Terms & Conditions', body: [
        'The financing bank may require a deposit as a condition of approval.',
        'Comprehensive vehicle insurance is generally required for the full duration of the finance agreement.',
        'Early settlement is permitted, subject to the settlement terms of your financing bank.',
        'N&N Motors is not liable for a bank\'s decision to decline, amend or withdraw a finance offer.'
      ]}
    ],
    cta: { label: 'Go to Finance Calculator', href: 'index.html#finance' }
  },
  'trade-in': {
    title: 'Trade-In / Sell Your Car',
    subtitle: 'How our valuations work',
    sections: [
      { heading: 'The Process', body: [
        'Bring your vehicle in for a physical inspection — this is how we confirm a valuation.',
        'Valuations consider the vehicle\'s condition, mileage, service history, market demand, and any outstanding finance.'
      ]},
      { heading: 'Documents Required', body: [
        'Original registration papers (or an eNaTIS printout).',
        'A valid ID.',
        'Proof of residence.',
        'Your current licence disc.',
        'Spare key(s) and the service book, where available.'
      ]},
      { heading: 'Terms & Conditions', body: [
        'Online or verbal estimates are indicative only and are not binding — a final value is confirmed after physical inspection.',
        'If there is outstanding finance on your vehicle, settlement is arranged directly with your current financier; any shortfall remains your responsibility.',
        'Trade-in valuations are valid for 7 days from the date of inspection.',
        'N&N Motors reserves the right to decline a trade-in that does not meet our resale criteria.'
      ]}
    ],
    cta: { label: 'Get a Trade-In Valuation', href: 'sell.html' }
  }
};

function ensureInfoModal(){
  if(document.getElementById('infoOverlay')) return;
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="enquire-overlay" id="infoOverlay">
      <div class="enquire-modal info-modal">
        <div class="enquire-bar">
          <span id="infoBarTitle">Details</span>
          <button type="button" id="infoCloseTop" aria-label="Close window">Close Window <i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="enquire-body info-body" id="infoBody"></div>
        <div class="enquire-bar">
          <span>&nbsp;</span>
          <button type="button" id="infoCloseBottom" aria-label="Close window">Close Window <i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(wrap.firstElementChild);
  const overlay = document.getElementById('infoOverlay');
  const closeModal = () => overlay.classList.remove('open');
  document.getElementById('infoCloseTop').addEventListener('click', closeModal);
  document.getElementById('infoCloseBottom').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) closeModal(); });
}
function openInfoModal(key){
  ensureInfoModal();
  const data = INFO_CONTENT[key];
  if(!data) return;
  document.getElementById('infoBarTitle').textContent = data.title;
  const sectionsHtml = data.sections.map(s => `
    <h4>${s.heading}</h4>
    <ul>${s.body.map(line => `<li>${line}</li>`).join('')}</ul>
  `).join('');
  document.getElementById('infoBody').innerHTML = `
    <p class="info-subtitle">${data.subtitle}</p>
    ${sectionsHtml}
    <p class="info-disclaimer"><i class="fa-solid fa-circle-info"></i> This page is a general guide and does not replace individual advice — contact us for details specific to your situation.</p>
    <a href="${data.cta.href}" class="btn btn-primary btn-block">${data.cta.label}</a>
  `;
  document.getElementById('infoOverlay').classList.add('open');
}

/* ---------- Shared vehicle card renderer ---------- */
function estimateMonthly(priceStr){
  const price = parseInt(String(priceStr).replace(/[^0-9]/g, ''), 10);
  if(isNaN(price)) return '';
  const deposit = price * 0.1;
  const monthlyRate = 0.125 / 12;
  const months = 60;
  const principal = price - deposit;
  const payment = principal * (monthlyRate * Math.pow(1+monthlyRate, months)) / (Math.pow(1+monthlyRate, months) - 1);
  return 'R' + Math.round(payment).toLocaleString('en-ZA');
}
function vehicleCardHTML(v, i){
  const isSold = v.availability === 'Sold';
  const displayPrice = v.salePrice || v.price;
  const pm = v.pm || estimateMonthly(displayPrice);
  return `
    <div class="img-wrap">
      <img src="${v.img}" alt="${v.year} ${v.make} ${v.model}" loading="lazy" style="${isSold ? 'filter:grayscale(60%);' : ''}">
      <div class="badge-year">${v.year}</div>
      ${isSold ? '<div class="badge-sold">SOLD</div>' : ''}
      <button class="wishlist" aria-label="Add to wishlist" onclick="toggleWishlist(this, '${v.make} ${v.model}')"><i class="fa-regular fa-heart"></i></button>
    </div>
    <div class="body">
      <div class="price">${displayPrice}</div>
      <div class="pm">${isSold ? 'No longer available' : `From <b>${pm}</b>/mo`}</div>
      <h3>${v.year} ${v.make} ${v.model}</h3>
      <div class="specs"><span><i class="fa-solid fa-gear"></i> ${v.trans}</span><span><i class="fa-solid fa-road"></i> ${v.km} km</span><span><i class="fa-solid fa-gas-pump"></i> ${v.fuel}</span></div>
      <div class="dealer"><i class="fa-solid fa-store"></i> N&amp;N Motors · Bloemfontein</div>
      <div class="cta-row">
        <a href="vehicle-details.html?id=${v.id}" class="btn btn-navy">View Details</a>
        ${isSold ? '' : `<a href="#" class="btn btn-ghost" onclick="openEnquireModal(${v.id}); return false;">Enquire</a>`}
      </div>
    </div>`;
}
function renderVehicleGrid(containerId, vehicles){
  const grid = document.getElementById(containerId);
  if(!grid) return;
  grid.innerHTML = '';
  vehicles.forEach((v,i)=>{
    const card = document.createElement('div');
    card.className = 'vcard reveal';
    card.style.setProperty('--i', i % 8);
    card.innerHTML = vehicleCardHTML(v, i);
    grid.appendChild(card);
  });
  observeReveals();
}

/* ---------- Vehicle listing controller: filters + sort + grid/list view ---------- */
function dedupeVehicles(list){
  const seen = new Set();
  return list.filter(v => {
    if(seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });
}
function vehiclePriceNum(v){
  return parseInt(String(v.salePrice || v.price || '').replace(/[^0-9]/g, ''), 10) || 0;
}
function vehicleKmNum(v){
  return parseInt(String(v.km || '').replace(/[^0-9]/g, ''), 10) || 0;
}
function setupVehicleListing(gridId, paginationId, allVehiclesRaw, perPage){
  perPage = perPage || 9;
  const allVehicles = dedupeVehicles(allVehiclesRaw); // guard against any duplicate entries in source data
  let viewMode = 'grid';

  const makeSelect = document.getElementById('filterMake');
  const modelSelect = document.getElementById('filterModel');
  const yearFromSelect = document.getElementById('filterYearFrom');
  const yearToSelect = document.getElementById('filterYearTo');
  const priceMinInput = document.getElementById('filterPriceMin');
  const priceMaxInput = document.getElementById('filterPriceMax');
  const maxMileageSelect = document.getElementById('filterMaxMileage');
  const sortSelect = document.getElementById('sortSelect');
  const applyBtn = document.getElementById('applyFiltersBtn');
  const clearBtn = document.getElementById('clearFiltersBtn');
  const noResultsClearBtn = document.getElementById('noResultsClear');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewListBtn = document.getElementById('viewListBtn');
  const grid = document.getElementById(gridId);
  const noResultsEl = document.getElementById('noResults');

  /* Populate Make dropdown — de-duplicated, alphabetical */
  function uniqueSorted(values){
    return Array.from(new Set(values.filter(Boolean))).sort();
  }
  if(makeSelect){
    uniqueSorted(allVehicles.map(v => v.make)).forEach(m => {
      const opt = document.createElement('option');
      opt.value = m; opt.textContent = m;
      makeSelect.appendChild(opt);
    });
  }
  /* Populate Model dropdown based on currently selected Make — de-duplicated */
  function refreshModelOptions(){
    if(!modelSelect) return;
    const selectedModel = modelSelect.value;
    modelSelect.innerHTML = '<option value="">Any Model</option>';
    const selectedMake = makeSelect ? makeSelect.value : '';
    const models = uniqueSorted(
      allVehicles.filter(v => !selectedMake || v.make === selectedMake).map(v => v.model)
    );
    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m; opt.textContent = m;
      modelSelect.appendChild(opt);
    });
    if(models.includes(selectedModel)) modelSelect.value = selectedModel;
  }
  refreshModelOptions();

  /* Populate Year From/To — de-duplicated, covers full data range */
  if(yearFromSelect && yearToSelect){
    const years = uniqueSorted(allVehicles.map(v => String(v.year))).sort((a,b) => b - a);
    years.forEach(y => {
      const o1 = document.createElement('option'); o1.value = y; o1.textContent = y; yearFromSelect.appendChild(o1);
      const o2 = document.createElement('option'); o2.value = y; o2.textContent = y; yearToSelect.appendChild(o2);
    });
  }

  function activeChipValues(group){
    return Array.from(document.querySelectorAll(`.chip-toggle[data-group="${group}"].active`)).map(c => c.textContent);
  }

  function applyFilters(opts){
    opts = opts || {};
    const make = makeSelect ? makeSelect.value : '';
    const model = modelSelect ? modelSelect.value : '';
    const priceMin = priceMinInput && priceMinInput.value ? parseFloat(priceMinInput.value) : 0;
    const priceMax = priceMaxInput && priceMaxInput.value ? parseFloat(priceMaxInput.value) : Infinity;
    const yearFrom = yearFromSelect && yearFromSelect.value ? parseInt(yearFromSelect.value, 10) : 0;
    const yearTo = yearToSelect && yearToSelect.value ? parseInt(yearToSelect.value, 10) : 9999;
    const maxMileage = maxMileageSelect && maxMileageSelect.value ? parseInt(maxMileageSelect.value, 10) : null;
    const bodyTypes = activeChipValues('body');
    const transmissions = activeChipValues('trans');
    const fuels = activeChipValues('fuel');

    let result = allVehicles.filter(v => {
      if(make && v.make !== make) return false;
      if(model && v.model !== model) return false;
      const price = vehiclePriceNum(v);
      if(price < priceMin || price > priceMax) return false;
      if(v.year < yearFrom || v.year > yearTo) return false;
      if(maxMileage !== null && vehicleKmNum(v) > maxMileage) return false;
      if(bodyTypes.length && !bodyTypes.includes(v.body)) return false;
      if(transmissions.length && !transmissions.includes(v.trans)) return false;
      if(fuels.length && !fuels.includes(v.fuel)) return false;
      return true;
    });

    result = dedupeVehicles(result);

    const sortVal = sortSelect ? sortSelect.value : 'newest';
    if(sortVal === 'price-asc') result.sort((a,b) => vehiclePriceNum(a) - vehiclePriceNum(b));
    else if(sortVal === 'price-desc') result.sort((a,b) => vehiclePriceNum(b) - vehiclePriceNum(a));
    else if(sortVal === 'mileage-asc') result.sort((a,b) => vehicleKmNum(a) - vehicleKmNum(b));
    else result.sort((a,b) => b.id - a.id); // newest listed

    if(grid) grid.classList.toggle('list-view', viewMode === 'list');
    if(noResultsEl) noResultsEl.style.display = result.length === 0 ? 'block' : 'none';

    setupPagination(gridId, paginationId, result, perPage);

    if(opts.closeMobileDrawer){
      const panel = document.getElementById('filtersPanel');
      const overlay = document.getElementById('filtersOverlay');
      if(panel) panel.classList.remove('open');
      if(overlay) overlay.classList.remove('open');
    }
  }

  /* Wire controls */
  if(makeSelect) makeSelect.addEventListener('change', () => { refreshModelOptions(); applyFilters(); });
  if(modelSelect) modelSelect.addEventListener('change', () => applyFilters());
  if(yearFromSelect) yearFromSelect.addEventListener('change', () => applyFilters());
  if(yearToSelect) yearToSelect.addEventListener('change', () => applyFilters());
  if(maxMileageSelect) maxMileageSelect.addEventListener('change', () => applyFilters());
  if(priceMinInput) priceMinInput.addEventListener('change', () => applyFilters());
  if(priceMaxInput) priceMaxInput.addEventListener('change', () => applyFilters());
  if(sortSelect) sortSelect.addEventListener('change', () => applyFilters());
  if(applyBtn) applyBtn.addEventListener('click', () => applyFilters({closeMobileDrawer:true}));
  document.querySelectorAll('.chip-toggle[data-group]').forEach(chip => chip.addEventListener('click', () => applyFilters()));

  function clearAll(){
    if(makeSelect) makeSelect.selectedIndex = 0;
    refreshModelOptions();
    if(modelSelect) modelSelect.selectedIndex = 0;
    if(yearFromSelect) yearFromSelect.selectedIndex = 0;
    if(yearToSelect) yearToSelect.selectedIndex = 0;
    if(maxMileageSelect) maxMileageSelect.selectedIndex = 0;
    if(priceMinInput) priceMinInput.value = '';
    if(priceMaxInput) priceMaxInput.value = '';
    if(sortSelect) sortSelect.selectedIndex = 0;
    document.querySelectorAll('.chip-toggle').forEach(c => c.classList.remove('active'));
    applyFilters();
  }
  if(clearBtn) clearBtn.addEventListener('click', clearAll);
  if(noResultsClearBtn) noResultsClearBtn.addEventListener('click', clearAll);

  /* Grid / list view toggle ("The grid listing" / "The items listing") */
  if(viewGridBtn && viewListBtn){
    viewGridBtn.addEventListener('click', () => {
      viewMode = 'grid';
      viewGridBtn.classList.add('active'); viewListBtn.classList.remove('active');
      applyFilters();
    });
    viewListBtn.addEventListener('click', () => {
      viewMode = 'list';
      viewListBtn.classList.add('active'); viewGridBtn.classList.remove('active');
      applyFilters();
    });
  }

  /* Support ?make=&model=&body=&trans=&maxPrice= style deep links from other pages (e.g. the homepage hero search) */
  const params = new URLSearchParams(window.location.search);
  const makeParam = params.get('make');
  if(makeParam && makeSelect){
    const match = Array.from(makeSelect.options).find(o => o.value.toLowerCase() === makeParam.toLowerCase());
    if(match) makeSelect.value = match.value;
  }
  refreshModelOptions();
  const modelParam = params.get('model');
  if(modelParam && modelSelect){
    const match = Array.from(modelSelect.options).find(o => o.value.toLowerCase() === modelParam.toLowerCase());
    if(match) modelSelect.value = match.value;
  }
  const bodyParam = params.get('body');
  if(bodyParam){
    const chip = Array.from(document.querySelectorAll('.chip-toggle[data-group="body"]')).find(c => c.textContent.toLowerCase() === bodyParam.toLowerCase());
    if(chip) chip.classList.add('active');
  }
  const transParam = params.get('trans');
  if(transParam){
    const chip = Array.from(document.querySelectorAll('.chip-toggle[data-group="trans"]')).find(c => c.textContent.toLowerCase() === transParam.toLowerCase());
    if(chip) chip.classList.add('active');
  }
  const maxPriceParam = params.get('maxPrice');
  if(maxPriceParam && priceMaxInput){
    priceMaxInput.value = maxPriceParam.replace(/[^0-9]/g, '');
  }

  applyFilters();
}

/* ---------- Homepage hero search (Buy a Car dock) ---------- */
function setupHeroSearch(formId, vehicles){
  const form = document.getElementById(formId);
  if(!form) return;
  const makeSel = document.getElementById('heroMake');
  const modelSel = document.getElementById('heroModel');
  const bodySel = document.getElementById('heroBodyType');
  const transSel = document.getElementById('heroTrans');
  const maxPriceInput = document.getElementById('heroMaxPrice');

  function uniqueSorted(values){ return Array.from(new Set(values.filter(Boolean))).sort(); }

  if(makeSel){
    uniqueSorted(vehicles.map(v => v.make)).forEach(m => {
      const opt = document.createElement('option');
      opt.value = m; opt.textContent = m;
      makeSel.appendChild(opt);
    });
  }
  function refreshHeroModels(){
    if(!modelSel) return;
    const selectedModel = modelSel.value;
    modelSel.innerHTML = '<option value="">Any Model</option>';
    const selectedMake = makeSel ? makeSel.value : '';
    const models = uniqueSorted(vehicles.filter(v => !selectedMake || v.make === selectedMake).map(v => v.model));
    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m; opt.textContent = m;
      modelSel.appendChild(opt);
    });
    if(models.includes(selectedModel)) modelSel.value = selectedModel;
  }
  refreshHeroModels();
  if(makeSel) makeSel.addEventListener('change', refreshHeroModels);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if(makeSel && makeSel.value) params.set('make', makeSel.value);
    if(modelSel && modelSel.value) params.set('model', modelSel.value);
    if(bodySel && bodySel.value) params.set('body', bodySel.value);
    if(transSel && transSel.value) params.set('trans', transSel.value);
    if(maxPriceInput && maxPriceInput.value){
      const digits = maxPriceInput.value.replace(/[^0-9]/g, '');
      if(digits) params.set('maxPrice', digits);
    }
    const qs = params.toString();
    window.location.href = 'vehicles.html' + (qs ? ('?' + qs) : '');
  });
}

/* ---------- Homepage Featured Vehicles: sort + grid/list view ---------- */
function setupFeaturedSort(gridId, vehicles){
  const grid = document.getElementById(gridId);
  if(!grid) return;
  let viewMode = 'grid';
  const sortSelect = document.getElementById('sortSelect');
  const viewGridBtn = document.getElementById('viewGridBtn');
  const viewListBtn = document.getElementById('viewListBtn');

  function render(){
    let list = dedupeVehicles(vehicles);
    const sortVal = sortSelect ? sortSelect.value : 'newest';
    if(sortVal === 'price-asc') list.sort((a,b) => vehiclePriceNum(a) - vehiclePriceNum(b));
    else if(sortVal === 'price-desc') list.sort((a,b) => vehiclePriceNum(b) - vehiclePriceNum(a));
    else if(sortVal === 'mileage-asc') list.sort((a,b) => vehicleKmNum(a) - vehicleKmNum(b));
    else list.sort((a,b) => b.id - a.id);
    grid.classList.toggle('list-view', viewMode === 'list');
    renderVehicleGrid(gridId, list);
  }

  if(sortSelect) sortSelect.addEventListener('change', render);
  if(viewGridBtn && viewListBtn){
    viewGridBtn.addEventListener('click', () => {
      viewMode = 'grid';
      viewGridBtn.classList.add('active'); viewListBtn.classList.remove('active');
      render();
    });
    viewListBtn.addEventListener('click', () => {
      viewMode = 'list';
      viewListBtn.classList.add('active'); viewGridBtn.classList.remove('active');
      render();
    });
  }
  render();
}

/* ---------- Pagination (3x3 grid, 9 per page) ---------- */
function setupPagination(gridId, paginationId, vehicles, perPage){
  perPage = perPage || 9;
  const totalPages = Math.max(1, Math.ceil(vehicles.length / perPage));
  let currentPage = 1;

  function renderPage(page, opts){
    opts = opts || {};
    currentPage = Math.min(Math.max(1, page), totalPages);
    const start = (currentPage - 1) * perPage;
    renderVehicleGrid(gridId, vehicles.slice(start, start + perPage));
    renderPaginationControls();
    const countEl = document.getElementById('resultsCount');
    if(countEl) countEl.textContent = vehicles.length;
    if(opts.scroll){
      const grid = document.getElementById(gridId);
      if(grid){
        const y = grid.getBoundingClientRect().top + window.pageYOffset - 110;
        window.scrollTo({top: y, behavior: 'smooth'});
      }
    }
  }

  function pageList(){
    const pages = [];
    if(totalPages <= 7){
      for(let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if(currentPage > 3) pages.push('…');
    for(let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if(currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  }

  function renderPaginationControls(){
    const el = document.getElementById(paginationId);
    if(!el) return;
    if(totalPages <= 1){ el.innerHTML = ''; return; }
    let html = `<button class="nav-arrow" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i> Prev</button>`;
    pageList().forEach(p => {
      if(p === '…') html += `<span class="dots">…</span>`;
      else html += `<button class="${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    });
    html += `<button class="nav-arrow" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next <i class="fa-solid fa-chevron-right"></i></button>`;
    el.innerHTML = html;
    el.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.getAttribute('data-page'), 10);
        if(!isNaN(p) && p >= 1 && p <= totalPages) renderPage(p, {scroll:true});
      });
    });
  }

  renderPage(1);
}

/* ---------- Dock tabs (homepage search widget) ---------- */
document.querySelectorAll('.dock-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    document.querySelectorAll('.dock-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.dock-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.querySelector(`.dock-panel[data-panel="${tab.dataset.tab}"]`);
    if(panel) panel.classList.add('active');
  });
});

/* ---------- Nav scroll shadow ---------- */
const siteNav = document.getElementById('site-nav');
if(siteNav){
  window.addEventListener('scroll', ()=>siteNav.classList.toggle('scrolled', window.scrollY > 20));
}

/* ---------- Mobile menu ---------- */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mmOverlay = document.getElementById('mmOverlay');
const closeMm = document.getElementById('closeMm');
if(hamburgerBtn && mobileMenu && mmOverlay && closeMm){
  const openMM = ()=>{ mobileMenu.classList.add('open'); mmOverlay.classList.add('open'); };
  const closeMMFn = ()=>{ mobileMenu.classList.remove('open'); mmOverlay.classList.remove('open'); };
  hamburgerBtn.addEventListener('click', openMM);
  closeMm.addEventListener('click', closeMMFn);
  mmOverlay.addEventListener('click', closeMMFn);
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMMFn));
}

/* ---------- Mobile filters drawer (vehicles listing page) ---------- */
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filtersPanel = document.getElementById('filtersPanel');
const filtersOverlay = document.getElementById('filtersOverlay');
const closeFilters = document.getElementById('closeFilters');
if(filterToggleBtn && filtersPanel && filtersOverlay){
  const openF = ()=>{ filtersPanel.classList.add('open'); filtersOverlay.classList.add('open'); };
  const closeF = ()=>{ filtersPanel.classList.remove('open'); filtersOverlay.classList.remove('open'); };
  filterToggleBtn.addEventListener('click', openF);
  filtersOverlay.addEventListener('click', closeF);
  if(closeFilters) closeFilters.addEventListener('click', closeF);
}

/* ---------- Chip-style toggle filters ---------- */
document.querySelectorAll('.chip-toggle').forEach(chip=>{
  chip.addEventListener('click', ()=>chip.classList.toggle('active'));
});

/* ---------- Reveal on scroll ---------- */
let revealIO;
function observeReveals(){
  if(!revealIO){
    revealIO = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('visible'); revealIO.unobserve(entry.target);} });
    }, {threshold:0.12});
  }
  document.querySelectorAll('.reveal:not(.visible)').forEach(el=>revealIO.observe(el));
}
observeReveals();

/* ---------- Animated counters ---------- */
const counterIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      let cur = 0; const step = Math.max(1, Math.round(target/40));
      const iv = setInterval(()=>{ cur += step; if(cur>=target){cur=target; clearInterval(iv);} el.innerHTML = cur + (suffix?`<span class="suffix">${suffix}</span>`:''); }, 30);
      counterIO.unobserve(el);
    }
  });
}, {threshold:0.4});
document.querySelectorAll('.num[data-count]').forEach(el=>counterIO.observe(el));

/* ---------- Finance calculator ---------- */
const priceEl=document.getElementById('calcPrice'), depositEl=document.getElementById('calcDeposit'),
      rateEl=document.getElementById('calcRate'), termEl=document.getElementById('calcTerm');
if(priceEl && depositEl && rateEl && termEl){
  const priceOut=document.getElementById('priceOut'), depositOut=document.getElementById('depositOut'),
        rateOut=document.getElementById('rateOut'), termOut=document.getElementById('termOut'),
        calcResult=document.getElementById('calcResult');
  const fmtR = (n)=> 'R' + Math.round(n).toLocaleString('en-ZA');
  function calcMonthly(){
    const price=parseFloat(priceEl.value), deposit=parseFloat(depositEl.value),
          annualRate=parseFloat(rateEl.value)/100, months=parseInt(termEl.value);
    const principal=Math.max(price-deposit,0), monthlyRate=annualRate/12;
    let payment = monthlyRate===0 ? principal/months : principal*(monthlyRate*Math.pow(1+monthlyRate,months))/(Math.pow(1+monthlyRate,months)-1);
    priceOut.textContent=fmtR(price); depositOut.textContent=fmtR(deposit);
    rateOut.textContent=(annualRate*100)+'%'; termOut.textContent=months+' months';
    calcResult.innerHTML = fmtR(payment) + '<span style="font-size:.95rem;">/mo</span>';
  }
  [priceEl,depositEl,rateEl,termEl].forEach(el=>el.addEventListener('input', calcMonthly));
  calcMonthly();
}
