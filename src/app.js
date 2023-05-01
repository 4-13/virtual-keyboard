import jsxToDom from './js/utils/jsxToDom.js';
import Keyboard from './keyboard.js';

class App {
  #keyboard;

  #$textarea;

  #isTextAreaFocused;

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
    this.#$textarea.addEventListener('focus', () => {
      this.#isTextAreaFocused = true;
    });

    this.#$textarea.addEventListener('blur', () => {
      this.#isTextAreaFocused = false;
    });

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
      // if (this.#isTextAreaFocused) return;

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
    const $container = jsxToDom('div', { class: 'container' });
    this.#$textarea = jsxToDom('textarea', {});
    const info1 = jsxToDom('p', {}, 'Клавиатура создана в операционной системе Windows');
    const info2 = jsxToDom('p', {}, 'Для переключения языка комбинация: ctrl + shift / 🌐 ');

    $container.append(this.#$textarea, this.#keyboard.getElem(), info1, info2);
    this.#$elem = $container;
  }
}

export default App;
