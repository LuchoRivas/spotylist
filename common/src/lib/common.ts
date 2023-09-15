export function common(): string {
  return 'common';
}

export function removeCodeAndStateFromQueryString() {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('code');
  searchParams.delete('state');
  const newUrl = `${window.location.pathname}?${searchParams.toString()}${
    window.location.hash
  }`;
  window.history.replaceState({}, document.title, newUrl);
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export const generateRandomString = (length: number) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
