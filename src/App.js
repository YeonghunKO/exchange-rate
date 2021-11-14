import { request } from './utils/api.js';

import InputValue from './components/inputValue.js';
import Rate from './components/rate.js';

import {
  currencyEl_one,
  currencyEl_two,
  amountEl_one,
  amountEl_two,
  swapBtn,
} from './utils/dom.js';

import { WHICH_INPUT } from './utils/constants.js';

import { isValidate, isChangedFirstInput } from './utils/validate.js';

export default function App() {
  let isChangedFlag;

  this.state = {
    firstInputValue: amountEl_one.value,
    firstInputCurrency: currencyEl_one.value,
    secondInputValue: 0,
    secondInputCurrency: currencyEl_two.value,
    resultCurrency: 0,
  };

  const calculate = async () => {
    const { firstInputValue, firstInputCurrency, secondInputCurrency } =
      this.state;

    const firstCurrencyData = await fetchData(firstInputCurrency);
    const resultCurrency =
      firstCurrencyData['conversion_rates'][secondInputCurrency];

    const secondInputValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: `${secondInputCurrency}`,
    }).format(firstInputValue * resultCurrency);

    return { resultCurrency, secondInputValue };
  };

  const setData = async (currency, inputValue, whichInput) => {
    switch (whichInput) {
      case WHICH_INPUT.FIRST:
        this.setState({
          ...this.state,
          firstInputCurrency: currency,
          firstInputValue: inputValue,
        });
        break;
      case WHICH_INPUT.SECOND:
        this.setState({
          ...this.state,
          secondInputCurrency: currency,
        });
        break;
    }
  };

  const firstInput = new InputValue({
    intialState: {
      inputValueEle: amountEl_one,
      inputValue: this.state.firstInputValue,
      currencyEle: currencyEl_one,
    },
    calculate: (currency, inputValue) => {
      setData(currency, inputValue, WHICH_INPUT.FIRST);
    },
  });

  const secondInput = new InputValue({
    intialState: {
      inputValueEle: amountEl_two,
      inputValue: this.state.secondInputValue,
      currencyEle: currencyEl_two,
    },
    calculate: (currency, inputValue) => {
      setData(currency, inputValue, WHICH_INPUT.SECOND);
    },
  });

  const rate = new Rate({
    initialState: {
      firstInputCurrency: this.state.firstInputCurrency,
      secondInputCurrency: this.state.secondInputCurrency,
      resultCurrency: this.state.resultCurrency,
    },
  });

  this.setState = async nextState => {
    if (isValidate(nextState)) {
      const currState = this.state;

      if (isChangedFirstInput(currState, nextState)) {
        isChangedFlag = true;
      } else {
        isChangedFlag = false;
      }

      // await 없으면 아래 this.state({}) => calculate 순으로 실행됨.
      // await 이름 잘지었네 ㅋㅋ
      this.state = { ...this.state, ...nextState };
      const { resultCurrency, secondInputValue } = await calculate();
      this.state = { ...this.state, resultCurrency, secondInputValue };

      // console.log(this.state);
      // console.log(isChangedFlag);
      rate.setState({
        firstInputCurrency: this.state.firstInputCurrency,
        secondInputCurrency: this.state.secondInputCurrency,
        resultCurrency: this.state.resultCurrency,
      });

      secondInput.setState({
        ...secondInput.state,
        inputValue: this.state.secondInputValue,
      });

      if (isChangedFlag) {
        secondInput.render();
      } else {
        rate.render();
        secondInput.render();
      }
    }
  };

  const fetchData = async currencyUnit => {
    const result = await request(currencyUnit);
    return result;
  };

  swapBtn.addEventListener('click', async () => {
    const temp = this.state.firstInputCurrency;
    this.state.firstInputCurrency = this.state.secondInputCurrency;
    this.state.secondInputCurrency = temp;
    currencyEl_one.value = this.state.firstInputCurrency;
    currencyEl_two.value = this.state.secondInputCurrency;

    this.setState({ ...this.state });
  });

  // 맨처음 실행했을때 환율과 결과값을 계산하기 위해.
  this.setState({ ...this.state });
}

// rate, secondInputValue 랜더링
// firstInputcurrncy, secondInputCurrency -> rate.render
// secondInputValue, resultCurrency -> secondInput.render
