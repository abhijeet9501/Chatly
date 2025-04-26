const checkFields = (arr) => {
    for (const element of arr) {
        if (!element || element == "") {
            return null; 
        }
    }
    return true; 
};

export { checkFields };
