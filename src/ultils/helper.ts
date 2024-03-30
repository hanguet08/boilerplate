import cx from 'classnames';

export class Helper {
  static emojiUrl = '/images/emoji/google-64.png';
}

export const activeClassname = (always: string, add: boolean, activeClass: string = 'active') => {
  return add ? cx(always, activeClass) : always;
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isServer = () => {
  return typeof window === 'undefined';
};

export const isBrowser = () => {
  return !isServer();
};
