export function checkIfNumber(value) {
    if (!value || typeof value != 'number') {
        throw 'Input must be a number';
    } 

    if (value <= 0) {
        throw 'Input must be greater than 0'
    }

    if (countDecimals(value) > 2) {
        throw 'only up to 2 decimal points are supported'
    }
}

export function getDividingTimes(value, dividingValue) {
    return Math.floor(value / dividingValue);
}

export function isArrayEmpty(arr) {
    return arr === undefined || arr.length === 0
}

function countDecimals(value) {
    if(Math.floor(value.valueOf()) === value.valueOf()) return 0;
    return value.toString().split(".")[1].length || 0; 
}