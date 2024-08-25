export const wordWithoutCharactersRegex = '/[^a-z0-9]/g';

/**
 * Truncate text
 * @param str Text to truncate
 * @param limit Limit of characters
 * @returns
 * @example
 * truncateText('hello world', 5)
 * // 'hello...'
 * truncateText('hello world', 20)
 * // 'hello world'
 */
export const truncateText = (str: string, limit: number = 20): string => {
  if (str.length > limit) {
    return str.slice(0, limit) + '...';
  }
  return str;
};

/**
 * Remove HTML tags from text
 * @param html HTML string
 * @returns string
 * @example
 * removeHTMLTagsFromText('<p>hello</p>')
 * // 'hello'
 * removeHTMLTagsFromText('<p>hello</p> <p>world</p>')
 * // 'hello world'
 */
export const removeHTMLTagsFromText = (html: string): string => {
  const regex = /<\/?[a-z]+(?=[\s>])(?:[^>=]|=(?:'[^']*'|"[^"]*"|[^'"\s]*))*\s?\/?>/;
  const htmlText = html.replace(regex, '').replace(/<[^>]*>?/gm, '');
  let text = htmlText.split('&nbsp;'); // remove nbsp
  return text.join(' ');
};

/**
 * Capitalize the first letter of a string
 * @param string A string
 * @returns string
 * @example
 * capitalizeFirstLetter('hello')
 * // 'Hello'
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0)?.toLocaleUpperCase() + str.slice(1)?.toLowerCase();
};

/**
 * Convert a string to camel case
 * @param str
 * @returns string
 * @example
 * toCamelCase('hello world')
 * // 'helloWorld'
 */
export const toCamelCase = (str: string): string => {
  return str
    .split(' ')
    .map((word, index) => {
      // Convert first word to lower case
      if (index === 0) {
        return word.toLowerCase();
      }
      // Capitalize the first letter of other words
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};

/**
 * Convert a camelCase to space case
 * @param str
 * @returns string
 * @example
 * toSpaceCase('helloWorld')
 * // 'Hello World'
 */
export const toSpaceCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1') // insert a space before all capital letters
    .replace(/^./, str[0].toUpperCase()); // capitalize the first letter
};

/**
 * Get initials from a sentence
 * @param sentence
 * @returns string
 * @example
 * getInitialsFromSentence('Jude Agboola')
 * // 'JA'
 * getInitialsFromSentence('Howard Lee')
 * // 'HL'
 */
export const getInitialsFromSentence = (sentence: string) => {
  const words = sentence?.split(' ');

  let initials = '';

  for (let i = 0; i < words.length; i++) {
    // if char is not a letter, skip
    if (!words[i].match(/[a-zA-Z]/)) continue;
    // Get the first character of each word and convert it to uppercase
    initials += words[i].charAt(0).toUpperCase();
  }

  return initials;
};

export const capitalizeWord = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

export const capitalizeWordsInSentence = (sentence: string): string => {
  if (!sentence) return '';
  return sentence
    .split(' ')
    .map(word => capitalizeWord(word))
    .join(' ');
};

export const sluggifyWord = (str: string, splitChar = '_'): string => {
  if (!str) return '';
  return str.toLowerCase().replace(wordWithoutCharactersRegex, splitChar);
};

export const desluggifyWord = (str: string, splitChar = '_'): string => {
  if (!str) return '';
  return str.split(splitChar).join(' ');
};

export const lowerCaseWord = (str: string): string => {
  return str.toLocaleLowerCase();
};

export const toTitleCase = (str: string, splitChar = ' ') => {
  return str
    .split(splitChar)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const simplePluralize = (word: string, length: number) => `${word}${length === 1 ? '' : 's'}`;
