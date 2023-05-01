import jsxToDom from './js/utils/jsxToDom.js';
import { readFromLocalStorage, writeToLocalStorage } from './js/utils/localStorage.js';
import en from './keyboard_languages/en.js';
import uk from './keyboard_languages/uk.js';
import ru from './keyboard_languages/ru.js';

const KEYBOARD_LAYOUT = [
  [
    'Backquote',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Digit0',
    'Minus',
    'Equal',
    'Backspace',
  ],
  [
    'Tab',
    'KeyQ',
    'KeyW',
    'KeyE',
    'KeyR',
    'KeyT',
    'KeyY',
    'KeyU',
    'KeyI',
    'KeyO',
    'KeyP',
    'BracketLeft',
    'BracketRight',
    'Backslash',
    'Delete',
  ],
  [
    'CapsLock',
    'KeyA',
    'KeyS',
    'KeyD',
    'KeyF',
    'KeyG',
    'KeyH',
    'KeyJ',
    'KeyK',
    'KeyL',
    'Semicolon',
    'Quote',
    'Enter',
  ],
  [
    'ShiftLeft',
    'IntlBackslash',
    'KeyZ',
    'KeyX',
    'KeyC',
    'KeyV',
    'KeyB',
    'KeyN',
    'KeyM',
    'Comma',
    'Period',
    'Slash',
    'ShiftRight',
  ],
  [
    'ControlLeft',
    'LangSwitch',
    'MetaLeft',
    'AltLeft',
    'Space',
    'AltRight',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
  ],
];

const CLASSNAMES = {
  keyboard: 'keyboard',
  keyboarRow: 'keyboard__row',
  keyboardButton: 'keyboard__button k-button',
  buttonDefaultText: 'k-button__default-text',
  buttonAlternateText: 'k-button__alternate-text',
};

const setButtonActive = ($button) => {
  $button.setAttribute('aria-pressed', 'true');
};

const setButtonNonActive = ($button) => {
  $button.setAttribute('aria-pressed', 'false');
};

const handleButtonClick = ($button) => {
  setButtonActive($button);

  $button.addEventListener('pointerleave', () => {
    setButtonNonActive($button);
  });

  $button.addEventListener('pointerup', () => {
    setButtonNonActive($button);
  });
};

const createKeyboardButton = ({
  defaultValue, alternateValue, key, type, ...propsObj
}) => {
  const $button = jsxToDom('button', ({
    class: CLASSNAMES.keyboardButton, 'data-code': key, 'data-type': type, ...propsObj,
  }));

  const $defaultText = jsxToDom('span', ({ class: CLASSNAMES.buttonDefaultText }), defaultValue);
  $button.append($defaultText);

  const $alternateText = jsxToDom('span', ({ class: CLASSNAMES.buttonAlternateText }), alternateValue);
  $button.append($alternateText);

  return $button;
};

class Keyboard {
  #currentIndex;

  #$buttons;

  #isShiftPressed;

  #isCapsLockPressed;

  constructor() {
    this.init();
  }

  init() {
    this.languages = [en, uk, ru];
    this.#currentIndex = readFromLocalStorage('currentLanguageIndex') || 0;
    this.#isShiftPressed = false;
    this.#isCapsLockPressed = false;
    this.#$buttons = new Map();
    this.#render();
    this.#bindListeners();
  }

  #bindListeners() {
    this.$elem.addEventListener('pointerdown', (e) => {
      const $button = e.target.closest('[data-code]');

      if (!$button) return;

      const code = $button.getAttribute('data-code');
      if (code.toLowerCase().startsWith('shift')) {
        this.#toggleShift(code);
      }

      if (code.toLowerCase().startsWith('capslock')) {
        this.toggleCapsLock();
      }

      if (code.toLowerCase().startsWith('langswitch')) {
        this.selectNextLanguage();
      }

      handleButtonClick($button);

      this.#dispatchEvent({ code });
    });

    document.addEventListener('keydown', (e) => {
      // e.preventDefault();
      const {
        code, repeat, shiftKey, ctrlKey,
      } = e;

      if (!this.#$buttons.has(code)) return;

      if (code.toLowerCase().startsWith('shift')) {
        if (repeat) return;

        this.#toggleShift(code);
      }

      if (code.toLowerCase().startsWith('capslock')) {
        if (repeat) return;

        this.toggleCapsLock();
      }

      if (ctrlKey && shiftKey) {
        this.selectNextLanguage();
      }

      const $button = this.#$buttons.get(code);

      setButtonActive($button);
      this.#dispatchEvent({ code });
    });

    document.addEventListener('keyup', (e) => {
      const { code } = e;
      if (!this.#$buttons.has(code)) return;

      if (code.toLowerCase().startsWith('shift')) {
        this.shiftPressed = { code, value: false };
      }

      const $button = this.#$buttons.get(code);

      setButtonNonActive($button);
    });
  }

  get shiftPressed() {
    return this.#isShiftPressed;
  }

  set shiftPressed({ value, code = '' }) {
    this.#isShiftPressed = value;
    this.$elem.setAttribute('data-shift-pressed', this.shiftPressed);
    this.$elem.setAttribute('data-shift-active', this.shiftPressed ? code : '');
  }

  #toggleShift(code) {
    this.shiftPressed = { code, value: !this.shiftPressed };
  }

  toggleCapsLock() {
    this.#isCapsLockPressed = !this.#isCapsLockPressed;
    this.$elem.setAttribute('data-capsLock-pressed', this.capsLockPressed);
  }

  get capsLockPressed() {
    return this.#isCapsLockPressed;
  }

  set capsLockPressed(val) {
    this.#isCapsLockPressed = val;
    this.$elem.setAttribute('data-capsLock-pressed', this.capsLockPressed);
  }

  get currentLanguageIndex() {
    return this.#currentIndex;
  }

  set currentLanguageIndex(value) {
    if (value < 0) {
      this.#currentIndex = 0;
    } else if (value >= this.languages.length) {
      this.#currentIndex = this.languages.length - 1;
    } else {
      this.#currentIndex = value;
    }

    this.#update();

    writeToLocalStorage('currentLanguageIndex', this.currentLanguageIndex);
  }

  get languagesLength() {
    return this.languages.length;
  }

  selectNextLanguage() {
    const currentLangIndex = this.currentLanguageIndex;
    this.currentLanguageIndex = currentLangIndex + 1 >= this.languagesLength
      ? 0 : currentLangIndex + 1;
  }

  get currentLanguage() {
    return this.languages[this.currentLanguageIndex];
  }

  #render() {
    const $keyboard = jsxToDom('div', {
      class: CLASSNAMES.keyboard,
      'data-shift-pressed': 'false',
      'data-capslock-pressed': 'false',
    });

    KEYBOARD_LAYOUT.forEach((row) => $keyboard.append(this.#getRowElem(row)));

    this.$elem = $keyboard;
  }

  #update() {
    const newRows = KEYBOARD_LAYOUT.map((row) => this.#getRowElem(row));
    this.$elem.replaceChildren(...newRows);
  }

  getElem() {
    if (!this.$elem) {
      this.#render();
    }

    return this.$elem;
  }

  #getRowElem(row) {
    const $keyboardRow = jsxToDom('div', { class: CLASSNAMES.keyboarRow });

    row.forEach((key) => {
      const { defaultValue, alternateValue, type } = this.currentLanguage.keys[key];
      const $button = createKeyboardButton({
        defaultValue, alternateValue, key, type,
      });
      $keyboardRow.append($button);

      this.#$buttons.set(key, $button);
    });

    return $keyboardRow;
  }

  #dispatchEvent({ code }) {
    let keyValue = '';

    const { defaultValue, alternateValue, type } = this.currentLanguage.keys[code];

    // debugger

    if (type === 'letter') {
      if (this.shiftPressed && this.capsLockPressed) {
        keyValue = defaultValue;
      } else if (this.shiftPressed || this.capsLockPressed) {
        keyValue = alternateValue;
      } else {
        keyValue = defaultValue;
      }
    } else if (type === 'char') {
      if (this.shiftPressed) {
        keyValue = alternateValue;
      } else {
        keyValue = defaultValue;
      }
    } else if (type === 'control' || type === 'cursor') {
      keyValue = defaultValue;
    }

    this.$elem.dispatchEvent(new CustomEvent('keyboardKeyDown', {
      bubbles: true,
      detail: { code, type, value: keyValue },
    }));
  }
}

export default Keyboard;
