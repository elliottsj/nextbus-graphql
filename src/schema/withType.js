import curry from 'lodash/fp/curry';

function withType(type, obj) {
  return { ...obj, type };
}

export default curry(withType);
