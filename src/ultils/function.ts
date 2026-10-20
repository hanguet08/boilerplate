import lodash from '@/ultils/lodash';

export function normalizeText(str: string) {
  if (typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function convertToOptions(collection: any[], value: string, label: string) {
  return lodash.map(collection, (item, index) => {
    return {
      value: item[value],
      label: item[label],
    };
  });
}

export function searchValueOptions(input, option) {
  const label = normalizeText(option?.label?.toString());
  const value = option?.value.toString();
  const searchString = normalizeText(input);

  return label?.indexOf(searchString) >= 0 || value === searchString;
}

export const getIds = (array, id) => {
  return array?.map((i) => i[id]);
};

export const filterInvalidField = (params): any => {
  return Object.keys(params).reduce(function (previous, key) {
    if (
      (Array.isArray(params[key]) && !params[key].length) ||
      params[key] === null ||
      params[key] === undefined ||
      params[key] === '' ||
      lodash.isNaN(params[key])
    )
      return previous;
    return { [key]: params[key], ...previous };
  }, {});
};

export const parseJSON = (value: any) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const stringifyJSON = (value: any) => {
  return JSON.stringify(value);
};

export const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (error) {
    return false;
  }
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const uid = (len) => {
  const buf = [],
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    charlen = chars.length;
  for (let i = 0; i < len; ++i) buf.push(chars[getRandomInt(0, charlen - 1)]);
  return buf.join('');
};
