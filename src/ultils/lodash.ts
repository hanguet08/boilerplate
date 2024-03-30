/* eslint-disable eqeqeq */
const debounce = (func, timeout: number) => {
  let timeoutId;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const head = (array) => {
  if (array == null || array.length < 1) {
    return undefined;
  }
  return array[0];
};

const isNumber = (value) => {
  return typeof value === 'number';
};

const checkIsObject = (value) => {
  const type = typeof value;
  return value !== null && type === 'object';
};

const keys = (object) => {
  if (!checkIsObject(object)) {
    return [];
  }
  return Object.keys(object);
};

function sortBy(collection, iteratees) {
  if (!Array.isArray(collection)) {
    return [];
  }

  const sortFunction = (a, b) => {
    for (const iteratee of iteratees) {
      const valueA = typeof iteratee === 'function' ? iteratee(a) : a[iteratee];
      const valueB = typeof iteratee === 'function' ? iteratee(b) : b[iteratee];

      if (valueA < valueB) {
        return -1;
      } else if (valueA > valueB) {
        return 1;
      }
    }
    return 0;
  };

  return collection.slice().sort(sortFunction);
}

const map = (array, iteratee) => {
  if (array == null || array == undefined) return [];

  const result = [];

  if (Array.isArray(array)) {
    for (let i = 0; i < array.length; i++) {
      const value = iteratee(array[i], i, array);
      result.push(value);
    }
  }

  if (typeof array === 'object' && !Array.isArray(array)) {
    for (const key in array) {
      const value = iteratee(array[key], key, array);
      result.push(value);
    }
  }

  return result;
};

function isEqual(value, other) {
  if (value === other || (value !== value && other !== other)) {
    return true;
  }

  if (value == null || other == null) {
    return false;
  }

  if (typeof value !== 'object' || typeof other !== 'object') {
    return false;
  }

  const valueKeys = Object.keys(value);
  const otherKeys = Object.keys(other);

  if (valueKeys.length !== otherKeys.length) {
    return false;
  }

  for (const key of valueKeys) {
    if (!Object.prototype.hasOwnProperty.call(other, key) || !isEqual(value[key], other[key])) {
      return false;
    }
  }

  return true;
}

function some(collection: any[] | object, predicate) {
  if (Array.isArray(collection)) {
    for (let i = 0; i < collection.length; i++) {
      if (predicate(collection[i], i, collection)) {
        return true;
      }
    }
  }

  if (typeof collection === 'object') {
    for (const key in collection) {
      if (predicate(collection[key], key, collection)) {
        return true;
      }
    }
  }

  return false;
}

const isNaN = (value) => {
  if (value === null) return false;
  return Number.isNaN(value);
};

const lodash = {
  debounce,
  head,
  isNumber,
  keys,
  sortBy,
  map,
  isEqual,
  some,
  isNaN,
};

export default lodash;
