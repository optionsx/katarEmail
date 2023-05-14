
export const log = console.log;
export const isValidEmail = (email: string): boolean => (email.match(/(@gmail.com|@)/) && email.length > 11) ? true : false;
// must contain @ and length > 11, sufficient enough