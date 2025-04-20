const checkFields = (arr) => {
    for (const element of arr) {
        if (!element || element == "") {
            return null; // Return null if any field is missing or empty
        }
    }
    return true; // Return true if all fields are valid
};

export { checkFields };