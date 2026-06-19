// === Render ===

const preferitiLista = document.getElementById('preferiti-lista');
const risultatiLista = document.getElementById('search-results-list');
const spinner = document.getElementById('loading-spinner');
const erroreAlert = document.getElementById('error-message');
const dettagliSection = document.getElementById('dettagli-section');

function mostraSpinner(show) {
  if (show) spinner.classList.remove('d-none');
  else spinner.classList.add('d-none');
}

function mostraErrore(show) {
  if (show) erroreAlert.classList.remove('d-none');
  else erroreAlert.classList.add('d-none');
}

function renderPreferiti() {
  preferitiLista.innerHTML = '';
  if (preferiti.length === 0) {
    preferitiLista.innerHTML = '<p class="text-muted fst-italic placeholder-text px-2">Non hai ancora salvato nessuna squadra. Cercane una qui sopra e aggiungila ai preferiti.</p>';
    return;
  }

  preferiti.forEach(squadra => {
    const card = creaCardSquadra(squadra, true);
    preferitiLista.appendChild(card);
  });
}

function renderRisultati(squadre) {
  risultatiLista.innerHTML = '';
  if (squadre.length === 0) {
    risultatiLista.innerHTML = '<p class="text-muted fst-italic placeholder-text px-2">Nessuna squadra trovata con questo nome.</p>';
    return;
  }

  squadre.forEach(squadra => {
    const isGiaPreferito = preferiti.some(p => p.idTeam === squadra.idTeam);
    const card = creaCardSquadra(squadra, false, isGiaPreferito);
    risultatiLista.appendChild(card);
  });
}

function creaCardSquadra(squadra, isFavList, isGiaPreferito = false) {
  const col = document.createElement('div');
  col.className = 'col-12 col-sm-6 col-md-4 col-lg-3 team-card-col';
  col.dataset.id = squadra.idTeam;
  
  const card = document.createElement('div');
  card.className = 'team-card';
  
  card.innerHTML = `
    <img src="${squadra.strBadge}" alt="${squadra.strTeam}" class="team-badge">
    <div class="team-name">${squadra.strTeam}</div>
    <div class="team-info">${squadra.strLeague}<br>${squadra.strCountry}</div>
  `;

  const btn = document.createElement('button');
  btn.className = 'btn-fav';

  if (isFavList) {
    btn.classList.add('remove');
    btn.innerHTML = '<i class="bi bi-star-fill"></i> Rimuovi';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      rimuoviPreferito(squadra.idTeam);
      const activeDettagli = dettagliSection.dataset.activeTeamId;
      if (activeDettagli === squadra.idTeam) {
        dettagliSection.classList.add('d-none');
      }
      const currentCols = risultatiLista.querySelectorAll('.team-card-col');
      currentCols.forEach(c => {
        if(c.dataset.id === squadra.idTeam) {
          const b = c.querySelector('.btn-fav');
          b.className = 'btn-fav add';
          b.innerHTML = '<i class="bi bi-star"></i> Aggiungi ai preferiti';
          b.disabled = false;
        }
      });
    });
  } else {
    if (isGiaPreferito) {
      btn.classList.add('already');
      btn.innerHTML = '<i class="bi bi-star-fill"></i> Già nei preferiti';
      btn.disabled = true;
    } else {
      btn.classList.add('add');
      btn.innerHTML = '<i class="bi bi-star"></i> Aggiungi ai preferiti';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        salvaPreferito(squadra);
        btn.className = 'btn-fav already';
        btn.innerHTML = '<i class="bi bi-star-fill"></i> Già nei preferiti';
        btn.disabled = true;
      });
    }
  }

  card.appendChild(btn);
  col.appendChild(card);

  card.addEventListener('click', async () => {
    dettagliSection.dataset.activeTeamId = squadra.idTeam;
    document.getElementById('dettagli-nome-squadra').innerText = squadra.strTeam;
    
    const { prossimi, ultimi } = await caricaDettagli(squadra.idTeam);
    
    const prossimiCont = document.getElementById('prossimi-eventi-lista');
    prossimiCont.innerHTML = '';
    if(prossimi.length === 0) {
      prossimiCont.innerHTML = '<p class="text-muted fst-italic placeholder-text">Nessun evento in programma</p>';
    } else {
      prossimi.forEach(e => {
        prossimiCont.innerHTML += `
          <div class="event-item">
            <div class="event-date">${e.dateEvent}</div>
            <div class="event-details">
              <span>${e.strEvent}</span>
            </div>
          </div>
        `;
      });
    }

    const ultimiCont = document.getElementById('ultimi-results-lista') || document.getElementById('ultimi-risultati-lista');
    ultimiCont.innerHTML = '';
    if(ultimi.length === 0) {
      ultimiCont.innerHTML = '<p class="text-muted fst-italic placeholder-text">Nessun risultato recente</p>';
    } else {
      ultimi.forEach(e => {
        const score = (e.intHomeScore !== null && e.intAwayScore !== null) ? `${e.intHomeScore} - ${e.intAwayScore}` : '-';
        ultimiCont.innerHTML += `
          <div class="event-item">
            <div class="event-date">${e.dateEvent}</div>
            <div class="event-details">
              <span>${e.strEvent}</span>
              <span class="event-score">${score}</span>
            </div>
          </div>
        `;
      });
    }

    dettagliSection.classList.remove('d-none');
    dettagliSection.scrollIntoView({ behavior: 'smooth' });
  });

  return col;
}