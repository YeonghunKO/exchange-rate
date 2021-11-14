import { rate } from '../utils/dom.js';

export default function Rate({ initialState }) {
  this.state = initialState;
  this.setState = nextState => {
    this.state = nextState;
    // this.render();
  };

  this.render = () => {
    const { firstInputCurrency, secondInputCurrency, resultCurrency } =
      this.state;
    rate.innerHTML = `1 ${firstInputCurrency} = ${secondInputCurrency} ${resultCurrency}`;
    console.log('rate render');
  };
}
