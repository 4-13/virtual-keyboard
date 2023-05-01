import jsxToDom from './js/utils/jsxToDom.js';
import Keyboard from './keyboard.js';

class App {
  #keyboard;

  #$textarea;

  #textareaValues;

  #$elem;

  constructor() {
    this.#init();
  }

  getElem() {
    if (!this.#$elem) {
      this.#render();
    }

    return this.#$elem;
  }

  get textareaValue() {
    return this.#textareaValues;
  }

  set textareaValue(val) {
    this.#textareaValues = val;
    this.#$textarea.value = this.#textareaValues.join('');
  }

  #init() {
    this.#keyboard = new Keyboard();
    this.#render();
    this.#textareaValues = [];
    this.#bindListeners();
  }

  #bindListeners() {
    this.#$textarea.addEventListener('input', (e) => {
      e.preventDefault();
    });

    this.#$textarea.addEventListener('change', (e) => {
      e.preventDefault();
    });

    document.addEventListener('keydown', (e) => {
      e.preventDefault();
    });

    this.#keyboard.getElem().addEventListener('keyboardKeyDown', (e) => {
      const { code, type, value } = e.detail;

      if (type === 'letter' || type === 'char' || type === 'cursor') {
        this.textareaValue = [...this.textareaValue, value];
        return;
      }
      if (code.toLowerCase().startsWith('backspace')) {
        this.textareaValue = this.textareaValue.slice(0, -1);
        return;
      }
      if (code.toLowerCase().startsWith('tab')) {
        this.textareaValue = [...this.textareaValue, '\t'];
        return;
      }
      if (code.toLowerCase().startsWith('enter')) {
        this.textareaValue = [...this.textareaValue, '\r'];
      }
    });
  }

  #render() {
    const $app = jsxToDom('div', { class: 'app' });
    const $container = jsxToDom('div', { class: 'app__container' });
    const $title = jsxToDom('h1', { class: 'app__title' }, 'RSS Виртуальная клавиатура');
    this.#$textarea = jsxToDom('textarea', { class: 'app__textarea' });

    const $infoContainer = jsxToDom('div', { class: 'info' });
    const $info1 = jsxToDom('p', { class: 'info__text' }, 'Клавиатура создана в операционной системе Windows');
    const $info2 = jsxToDom('p', { class: 'info__text' }, 'Для переключения языка используйте: ctrl + alt / 🌐 ');
    $infoContainer.append($info1, $info2);

    $container.append($title, this.#$textarea, this.#keyboard.getElem(), $infoContainer);

    $app.append($container);
    this.#$elem = $app;
  }
}

export default App;
