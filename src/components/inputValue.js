import { amountEl_one } from '../utils/dom.js';

export default function InputValue({ intialState, calculate }) {
  this.state = intialState;
  const { inputValueEle, currencyEle } = this.state;

  this.setState = nextState => {
    this.state = nextState;
    // this.render();
  };

  this.render = () => {
    const { inputValue } = this.state;
    // currency.setAttribute('selected', '');
    inputValueEle.value = inputValue;
    console.log(`${inputValue} render`);
  };

  currencyEle.addEventListener('change', () => {
    calculate(currencyEle.value, inputValueEle.value);
  });

  inputValueEle.addEventListener('input', () => {
    calculate(currencyEle.value, inputValueEle.value);
  });
}
