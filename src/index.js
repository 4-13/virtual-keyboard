import Keyboard from './keyboard.js';

const loadLanguages = async () => {
  // const languagesFileNames = ['en.json', 'ru.json', 'uk.json'];
  const languagesFileNames = ['en.json'];
  const languagePromises = languagesFileNames.map((languageFileName) => fetch(`./keyboard_languages/${languageFileName}`));
  const languageResponses = await Promise.all(languagePromises);

  return (Promise.all(languageResponses.map(async (res) => res.json())));
};

loadLanguages().then((languages) => {
  const keyboard = new Keyboard({ languages });
  document.body.append(keyboard.getElem());
});
