export const isUsernameValid = (username: string): boolean => {
  // Username must be at least 6 characters long and maximum 25 characters long
  // Username must contain only alphanumeric characters and these special characters: !@#()_.

  const usernameRegex = /^[a-zA-Z0-9!@#()_.]{6,25}$/;
  return usernameRegex.test(username);
};
