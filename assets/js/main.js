// SportsHub — Week Project Settimana VII
//
// Versione Avanzata: main.js (solo logica di avvio e gestione eventi submit)

// === Stato ===

let preferiti = JSON.parse(localStorage.getItem('sportsHub_preferiti')) || [];

function salvaPreferito(squadra) {
  if (!preferiti.some(p => p.idTeam === squadra.idTeam)) {
    preferiti.push(squadra);
    localStorage.setItem('sportsHub_preferiti', JSON.stringify(preferiti));
    renderPreferiti();
  }
}

function rimuoviPreferito(idTeam) {
  preferiti = preferiti.filter(p => p.idTeam !== idTeam);
  localStorage.setItem('sportsHub_preferiti', JSON.stringify(preferiti));
  renderPreferiti();
}

// === Eventi ===

const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');

// Rimuoviamo l'event listener 'input' con il debounce.
// Il form gestisce già il submit al click o alla pressione di Invio.

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    const squadre = await cercaSquadre(query);
    renderRisultati(squadre);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderPreferiti();
});