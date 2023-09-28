// Function to generate a random string of a specified length
export function generateRandomString(length:number) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
    
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
    
  return randomString;
}
  
// Set of used random strings (to ensure uniqueness)
const usedRandomStrings = new Set();
  
// Function to generate a unique random string
export function generateUniqueRandomString(length:number) {
  let randomString;
    
  do {
    randomString = generateRandomString(length);
  } while (usedRandomStrings.has(randomString));
    
  usedRandomStrings.add(randomString);
  return randomString;
}
  
