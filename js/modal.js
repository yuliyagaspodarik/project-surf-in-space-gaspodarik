'use strict';

game.modal = {
  game,
  modal() {
    $('#modal').show();
    $('.backdrop').addClass('open');
    $('.modal').addClass('open');

    const result = document.getElementById('result');
    result.textContent = `Your result: ${this.game.score}!`;

    $('#save-result').click(() => {
      function nameValidation(value, elem, args) {
        if (value.length >= args) return false;
        return /^[A-ZА-ЯЁ][a-zа-яё]+$/.test(value);
      }

      $.validator.addMethod('name', nameValidation,
        'Введите имя с большой буквы');
      $('#valid-name').validate({
        rules:
          {
            im: {required: true, name: 20}
          },
        messages:
          {
            im:
              {
                required: 'Укажите имя!',
                russian_name: 'Введите нормальное имя!'
              }
          }
      });
      this.game.records.push({
        name: document.getElementById('player-name').value || 'Nameless',
        score: this.game.score
      });
      const password = '123';
      $.ajax({
        url: this.game.AjaxHandlerScript,
        type: 'POST',
        data: {
          f: 'LOCKGET',
          n: 'GASPODARIK_PROJECT_SURFINSPACE',
          p: password
        },
        cache: false,
        success: function () {
          $.ajax({
            url: this.game.AjaxHandlerScript,
            type: 'POST',
            data: {
              f: 'UPDATE',
              n: 'GASPODARIK_PROJECT_SURFINSPACE',
              p: password,
              v: JSON.stringify(this.game.records)
            },
            cache: false,
            success: (response) => {
              console.log(response);
            },
            error: this.errorHandler
          });
        },
        error: this.errorHandler
      });
      this.closeModal();
    });
    $('.modal__action--negative').click(() => {
      this.closeModal();
    });
  },
  closeModal() {
    $('.backdrop').removeClass('open');
    $('.modal').removeClass('open');
    window.location.reload();
  },
  errorHandler(jqXHR, StatusStr, ErrorStr) {
    console.log(StatusStr + ' ' + ErrorStr);
  }
};