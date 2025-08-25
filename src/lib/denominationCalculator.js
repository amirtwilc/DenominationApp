import { SUPPORTED_DENOMINATIONS } from "@/constants/denominations";
import { getDividingTimes } from './helpers';

export function getDenominationQuantities(value) {
    let result = [];
    SUPPORTED_DENOMINATIONS.forEach(currentDenomination => {
        var quantity = getDividingTimes(value,currentDenomination);
        if (quantity > 0) {
          result.push({'denomination': currentDenomination.toFixed(2), 'quantity': quantity});
          value = (value - (currentDenomination * quantity)).toFixed(2); // without toFixed(2) calculation is not occurate
        }
      });
    return result;
}

export function getDenominationDifference(newTableResults, oldTableResults) {
    var differenceTableResults = [];
    SUPPORTED_DENOMINATIONS.forEach(currentDenomination => {
        var newTableDenominationObject = newTableResults.find(x => x.denomination == currentDenomination);
        var oldTableDenominationObject = oldTableResults.find(x => x.denomination == currentDenomination);

        if (newTableDenominationObject || oldTableDenominationObject) {
            var newTableDenominationValue = getDenominationQuantityValue(newTableDenominationObject);
            var oldTableDenominationValue = getDenominationQuantityValue(oldTableDenominationObject);

            var difference = newTableDenominationValue - oldTableDenominationValue;
            if (difference > 0) {
                difference = '+' + difference; //display positive values with +
            }
            
            differenceTableResults.push({'denomination': currentDenomination.toFixed(2), 'difference': difference});
        }
    });

    return differenceTableResults;
}

function getDenominationQuantityValue(denominationObject) {
    if (denominationObject === undefined) {
        return 0;
    } else {
        return denominationObject.quantity;
    }
}