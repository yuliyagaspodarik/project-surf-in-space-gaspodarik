 game.spa = {
  game,
   renderNewState() {
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
         $('#spa').show();
         $('#modal').hide();
         $('#game').hide();
         $('#records').hide();
         $('#rules').hide();
         break;
       case 'Game':
         /*window.onload = function () {
           game();
         };*/
         $('#spa').hide();
         $('#modal').hide();
         $('#game').show();
         $('#records').hide();
         $('#rules').hide();
         break;
       case 'Records':
         page += '<ul id="records-content">';
         for(let i = 0; i <=8; i++) {
           page += `<li><span class="records-name">${this.game.records[i].name}</span> <span class="records-score">${this.game.records[i].score}</span></li>`;
         }
         page += '</ul>';
         document.getElementById('wrapper-records').innerHTML = page;//?
         $('#spa').hide();
         $('#modal').hide();
         $('#game').hide();
         $('#records').show();
         $('#rules').hide();
         break;
       case 'Rules':
         $('#spa').hide();
         $('#modal').hide();
         $('#game').hide();
         $('#records').hide();
         $('#rules').show();
         break;
       default:
         $('#spa').show();
         $('#modal').hide();
         $('#game').hide();
         $('#records').hide();
         $('#rules').hide();
         break;
     }
   }
};
 ///////////////////?????????? рефакторинг ниже
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
      $('#spa').show();
      $('#modal').hide();
      $('#game').hide();
      $('#records').hide();
      $('#rules').hide();
      break;
    case 'Game':
      /*window.onload = function () {
        game();
      };*/
      $('#spa').hide();
      $('#modal').hide();
      $('#game').show();
      $('#records').hide();
      $('#rules').hide();
      break;
    case 'Records':
      page += '<ul id="records-content">';
      for(let i = 0; i <=8; i++) {
      page += `<li><span class="records-name">${game.records[i].name}</span> <span class="records-score">${game.records[i].score}</span></li>`;
      }
      page += '</ul>';
      document.getElementById('wrapper-records').innerHTML = page;//?
      $('#spa').hide();
      $('#modal').hide();
      $('#game').hide();
      $('#records').show();
      $('#rules').hide();
      break;
    case 'Rules':
      $('#spa').hide();
      $('#modal').hide();
      $('#game').hide();
      $('#records').hide();
      $('#rules').show();
      break;
    default:
      $('#spa').show();
      $('#modal').hide();
      $('#game').hide();
      $('#records').hide();
      $('#rules').hide();
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