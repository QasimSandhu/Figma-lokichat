export const capitalizeFirstLetter = (string: string) => {
  // Check if the input string is not empty
  if (string.length === 0) {
    return string;
  }

  // Capitalize the first letter and concatenate it with the rest of the string
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateRandomString = (length = 9) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let referralCode = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters.charAt(randomIndex);
  }

  return referralCode;
};
