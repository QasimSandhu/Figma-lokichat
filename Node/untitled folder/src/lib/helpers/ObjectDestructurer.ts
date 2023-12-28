class ObjectManipulator {
  static distruct(obj) {
    let newObj = {};
    for (let key in obj) {
      newObj[key] = obj[key];
    }
    return newObj;
  }
}

export default ObjectManipulator;