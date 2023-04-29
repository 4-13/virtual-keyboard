import jsxToDom from './js/utils/jsxToDom.js';
// import KeyboardButton from './keyboard_languages/keyboard_button.js';

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
    'IntlBackslash',
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
    'Backslash',
    'Enter',
  ],
  [
    'ShiftLeft',
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

  constructor({ languages }) {
    this.languages = languages;
    this.init();
  }

  init() {
    this.#currentIndex = 0;
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
        this.toggleShift(code);
      }

      if (code.toLowerCase().startsWith('capslock')) {
        this.toggleCapsLock();
      }

      handleButtonClick($button);
    });

    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      const { code, repeat } = e;

      if (!this.#$buttons.has(code)) return;

      if (code.toLowerCase().startsWith('shift')) {
        if (repeat) return;

        this.toggleShift(code);
      }
      if (code.toLowerCase().startsWith('capslock')) {
        if (repeat) return;

        this.toggleCapsLock();
      }

      const $button = this.#$buttons.get(code);

      setButtonActive($button);
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

  toggleShift(code) {
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
}

export default Keyboard;
