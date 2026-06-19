// === Classi ===

class Squadra {
  constructor(idTeam, strTeam, strBadge, strLeague, strCountry) {
    this.idTeam = idTeam;
    this.strTeam = strTeam;
    this.strBadge = strBadge;
    this.strLeague = strLeague;
    this.strCountry = strCountry;
  }
}

class Evento {
  constructor(idEvent, dateEvent, strEvent, strHomeTeam, strAwayTeam, intHomeScore, intAwayScore) {
    this.idEvent = idEvent;
    this.dateEvent = dateEvent;
    this.strEvent = strEvent;
    this.strHomeTeam = strHomeTeam;
    this.strAwayTeam = strAwayTeam;
    this.intHomeScore = intHomeScore;
    this.intAwayScore = intAwayScore;
  }
}

// === API ===

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3/';

async function cercaSquadre(query) {
  mostraSpinner(true);
  mostraErrore(false);
  try {
    const response = await fetch(`${BASE_URL}searchteams.php?t=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    mostraSpinner(false);
    
    if (!data.teams) return [];
    
    return data.teams.map(t => new Squadra(t.idTeam, t.strTeam, t.strBadge, t.strLeague, t.strCountry));
  } catch (error) {
    mostraSpinner(false);
    mostraErrore(true);
    return [];
  }
}

async function caricaDettagli(idTeam) {
  mostraSpinner(true);
  mostraErrore(false);
  try {
    const [resNext, resLast] = await Promise.all([
      fetch(`${BASE_URL}eventsnext.php?id=${idTeam}`).then(r => r.json()),
      fetch(`${BASE_URL}eventslast.php?id=${idTeam}`).then(r => r.json())
    ]);
    mostraSpinner(false);

    const prossimi = (resNext.events || []).map(e => new Evento(
      e.idEvent, e.dateEvent, e.strEvent, e.strHomeTeam, e.strAwayTeam, e.intHomeScore, e.intAwayScore
    ));

    const ultimi = (resLast.results || []).map(e => new Evento(
      e.idEvent, e.dateEvent, e.strEvent, e.strHomeTeam, e.strAwayTeam, e.intHomeScore, e.intAwayScore
    ));

    return { prossimi, ultimi };
  } catch (error) {
    mostraSpinner(false);
    mostraErrore(true);
    return { prossimi: [], ultimi: [] };
  }
}