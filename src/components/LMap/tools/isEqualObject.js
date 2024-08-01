function isEqual(obj1, obj2) {
    // Check if both arguments are of type 'object'
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    // Check if both arguments are null (since typeof null is 'object')
    if (obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }

    // Get the keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if the number of properties is the same
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Check if values for the same property are equal
    for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // If values are objects, call isEqual recursively
        const areObjects = typeof val1 === 'object' && typeof val2 === 'object';
        if (areObjects && !isEqual(val1, val2) || !areObjects && val1 !== val2) {
            return false;
        }
    }

    return true;
}
export default isEqual;
