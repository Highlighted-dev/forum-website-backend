export const isUsernameValid = (username: string): boolean => {
  // Username must be at least 4 characters long and maximum 25 characters long
  // Username must contain only alphanumeric characters and these special characters: !@#()_.
  const usernameRegex = /^[a-zA-Z0-9!@#()_.]{4,25}$/;
  return usernameRegex.test(username);
};

export const isMessageValid = (message: string): boolean => {
  // Message must be at least 1 character long and maximum 500 characters long.
  // Message must contain only alphanumeric characters, spaces, special characters and emojis (ex. ♿🔥).
  const messageRegex =
    /^[a-zA-Z0-9\s!@#()_.,?\uD83C-\uDBFF\uDC00-\uDFFF]{1,500}$/;
  return messageRegex.test(message);
};
