import axios from 'axios';

const calculateUrl = 'http://localhost:8080/denomination/v1/calculate';

export async function getDenominationCalculation(amount) {
    return axios.post(`${calculateUrl}/${amount}`);
}
export async function getDenominationCalculationAndDifference(amount, tableResults) {
    let body = {"denominationQuantityList": tableResults}
    let jsonBody = JSON.stringify(body);
    return axios.post(`${calculateUrl}/${amount}`, jsonBody);
}