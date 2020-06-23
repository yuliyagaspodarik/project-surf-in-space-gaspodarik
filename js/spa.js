'use strict';
window.onhashchange = renderNewState;
function renderNewState() {
const hash = window.location.hash;
let state = decodeURIComponent(hash.substr(1));

if (state === '') {
  state = {pageName: 'Main'}
} else {
  state = JSON.parse(state);
}
let page = '';

  switch (state.pageName) {
    case 'Main':
      document.getElementById('spa').style.display = 'block';
      document.getElementById('modal').style.display = 'none';
      document.getElementById('game').style.display = 'none';
      document.getElementById('records').style.display = 'none';
      document.getElementById('rules').style.display = 'none';
      break;
    case 'Game':
      /*window.onload = function () {
        game();
      };*/
      document.getElementById('spa').style.display = 'none';
      document.getElementById('modal').style.display = 'none';
      document.getElementById('game').style.display = 'block';
      document.getElementById('records').style.display = 'none';
      document.getElementById('rules').style.display = 'none';

      break;
    case 'Records':
      page += '<ul id="records-content">';
      for(let i = 0; i <=8; i++) {
      page += `<li><span class="records-name">${records[i].name}</span> <span class="records-score">${records[i].score}</span></li>`;
      }
      page += '</ul>';
      document.getElementById('wrapper-records').innerHTML = page;
      document.getElementById('spa').style.display = 'none';
      document.getElementById('modal').style.display = 'none';
      document.getElementById('game').style.display = 'none';
      document.getElementById('records').style.display = 'block';
      document.getElementById('rules').style.display = 'none';
      break;
    case 'Rules':
      document.getElementById('spa').style.display = 'none';
      document.getElementById('modal').style.display = 'none';
      document.getElementById('game').style.display = 'none';
      document.getElementById('records').style.display = 'none';
      document.getElementById('rules').style.display = 'block';
      break;
    default:
      document.getElementById('spa').style.display = 'block';
      document.getElementById('modal').style.display = 'none';
      document.getElementById('game').style.display = 'none';
      document.getElementById('records').style.display = 'none';
      document.getElementById('rules').style.display = 'none';
      break;
  }
}

function switchToMainPage() {
  switchToState({pageName: 'Main'});
}

function switchToGamePage() {
  switchToState({pageName: 'Game'});
}

function switchToRecordsPage() {
  switchToState({pageName: 'Records'});
}

function switchToRulesPage() {
  switchToState({pageName: 'Rules'});
}

function switchToState(state) {
location.hash = encodeURIComponent(JSON.stringify(state));
}

renderNewState();