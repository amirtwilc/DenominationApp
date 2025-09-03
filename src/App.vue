<script setup>
import { APP_NAME, NEW_COLUMN_TITLES, DIFFERENCE_COLUMN_TITLES } from './constants/names'
import { checkIfNumber, isArrayEmpty } from './lib/helpers';
import { getDenominationQuantities, getDenominationDifference } from './lib/denominationCalculator'
import axios from 'axios';
import { getDenominationCalculation, getDenominationCalculationAndDifference } from './lib/restCaller';
axios.defaults.headers.post["Content-Type"] = "application/json";
</script>

<script>
export default {
  data() {
    return {
      submittedValue: null, //contains the current submitted value 
      errorMessage: '', //error messages will be entered here
      newSubmittedValue: 'Not submitted yet', //contains the newest value, will be displayed on screen
      oldSubmittedValue: 'Not submitted yet', //contains the old value, will be displayed on screen
      newTableResults: [],
      differenceTableResults: [],
      tempTableResults: [], //will contain results before deleting newTableResults array
      isFront: true
    }
  },
  methods: {
    registerAnswer() {
      this.errorMessage = ''; //reinitializing errorMessage
      this.submittedValue = parseFloat(this.submittedValue);

      if (!this.isValidInput()) {
        return;
      }

      var isFirstTimeCalculation = isArrayEmpty(this.newTableResults)
      if (this.isFront) {
        console.log('Calculation is via fronent')
        this.performFrontEndCalculation(isFirstTimeCalculation);
      }
      else {
        console.log('Calculation is via backend')
        this.performBackendCalculation(isFirstTimeCalculation);
      }

      this.newSubmittedValue = this.submittedValue.toFixed(2) + '€'; 
    },
    isValidInput() {
      try {
        checkIfNumber(this.submittedValue)
      } catch (message) {
        this.errorMessage = message;
        return false;
      }

      if (this.submittedValue == this.newSubmittedValue.substring(0, this.newSubmittedValue.length - 1)) {
        this.errorMessage = 'Please pick a different amount';
        return false;
      }
      return true;
    },
    performFrontEndCalculation(isFirstTimeCalculation) {
        if (!isFirstTimeCalculation) {
          this.oldSubmittedValue = this.newSubmittedValue;
          this.tempTableResults = this.newTableResults.slice(); //copy array
        }

        this.newTableResults = getDenominationQuantities(this.submittedValue);

        if (!isFirstTimeCalculation) {
          this.differenceTableResults = getDenominationDifference(this.newTableResults, this.tempTableResults);
        }
    },
    async performBackendCalculation(isFirstTimeCalculation) {
        let response = '';
        try {
          if (isFirstTimeCalculation) {
            response = await getDenominationCalculation(this.submittedValue);
          } else {
            response = await getDenominationCalculationAndDifference(this.submittedValue, this.newTableResults);
            this.oldSubmittedValue = this.newSubmittedValue;
            this.differenceTableResults = response.data.denominationDifferenceList;
          }
        }  catch (err) {
          this.errorMessage = "Error has occurred. Maybe try a different value";
          return;
        }
        this.newTableResults = response.data.denominationQuantityList;
    }
  }
}
</script>

<template>
  <div>
    <h1>{{ APP_NAME }}</h1>
    <label>Choose calculation preference: </label><br></br>
    <input  type="radio" name="a" v-model="isFront" v-bind:value="true"><label>Frontend </label>
    <input type="radio" v-model="isFront" v-bind:value="false"><label>Backend</label>
    <br></br><br></br>
    <form @submit.prevent="registerAnswer">
      <label>Enter amount in Euros
        <input v-model="submittedValue" type="text" placeHolder="enter value">
      </label>
      <button type="submit">Submit</button>
    </form>
    <div>{{errorMessage}}</div>
    <br/>
    <div class="side-by-side">
        <h3>New value:</h3>
        <p id="pAnswer">{{ newSubmittedValue }}</p>
        <table  border="1">
          <thead>
              <tr>
                  <th v-for="(column, index) in NEW_COLUMN_TITLES" :key="index"> {{column}}</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="(item, index) in newTableResults" :key="index">
                  <td v-for="(value, itemIndex) in item" :key="itemIndex">{{value}}</td>
              </tr>
          </tbody>
        </table>
    </div>
    <div class="side-by-sided">
        <h3>Old value:</h3>
        <p id="pAnswer">{{ oldSubmittedValue }}</p>
        <table border="1">
          <thead>
              <tr>
                  <th v-for="(column, index) in DIFFERENCE_COLUMN_TITLES" :key="index"> {{column}}</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="(item, index) in differenceTableResults" :key="index">
                  <td v-for="(value, itemIndex) in item" :key="itemIndex">{{value}}</td>
              </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>

<style scoped>
  h1 {
    margin-top: 0px;
    margin-bottom: 10px;
    font-family: sans-serif;
    font-size: 6rem;
    background: linear-gradient(to right, #ef5350, #f48fb1, #7e57c2, #2196f3, #26c6da, #43a047, #eeff41, #f9a825, #ff5722);
    background-clip: content-box;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    white-space: nowrap; /* force text to be in 1 line */
  } 
  div {
    border-radius: 10px;
    padding: 0 20px 20px 20px;
    margin-top: 20px;
    display: inline-block;
  }
  button {
    margin: 10px;
    display: block;
  }
  #pAnswer {
    padding: 5px;
  }
</style> 
