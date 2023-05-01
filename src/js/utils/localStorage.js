function writeToLocalStorage(key, value) {
  if (typeof (Storage) === 'undefined') {
    return false;
  }

  const serializedValue = JSON.stringify(value);

  try {
    window.localStorage.setItem(key, serializedValue);
  } catch (e) {
    localStorage.clear();
    window.localStorage.setItem(key, serializedValue);
  }

  return true;
}

function readFromLocalStorage(key) {
  if (typeof (Storage) === 'undefined') {
    return null;
  }

  const value = JSON.parse(localStorage.getItem(key));
  return value;
}

export { writeToLocalStorage, readFromLocalStorage };
