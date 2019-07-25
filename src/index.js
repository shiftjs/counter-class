import React from 'react';
import ReactDOM from 'react-dom';

/*
 * Make sure to import the ShiftJS macro before importing any backend
 * functions.
 */
import '@binaris/shift-babel-macro/macro';

/*
 * We can import backend functions into our code and call them like any
 * regular function. The only thing to note is that instead of returning
 * a value directly, these functions return a Promise() to the return value,
 * so make sure to use .then() or await to get the actual response.
 */
import {
  backendGetCounter,
  backendIncrementCounter,
} from '../backend/backend';

import './index.css';

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: undefined };
    this.increment = this.increment.bind(this);
  }

  componentDidMount() {
    /*
     * Upon mouting, issue a call to the backend to get the initial count.
     * Any backend function returns a Promise() which is resolved with the
     * value returned from the backend.
     */
    backendGetCounter()

      /*
       * The backend returns the count value. This value is undefined
       * when the application is run for the first time, in which case
       * we use the default value of zero.
       */
      .then(count => this.setState({ count: count || 0 }))

      /*
       * If the backend call generated an error, we set count to null.
       */
      .catch(() => this.setState({ count: null }));
  }

  /*
   * We increment the local counter first (triggering a render) and then
   * send the update to the backend. This results in a more responsive UI
   * but has the downside that the display is updated before the new value
   * is persisted in the backend. If the backend fails to update, the user
   * will think that the counter was upated, but a subsequent app reload
   * would show a different value.
   *
   * In a real app, we would probably wait for the backend to update before
   * updating the display. Alternatively we could update the display first
   * but add an indicator for 'Updating' or 'Saving'.
   */
  increment() {
    this.setState({ count: this.state.count + 1 });
    backendIncrementCounter();
  }

  render() {
    /*
     * The page will display this string until we get the count value.
     */
    if (this.state.count === undefined) {
      return 'Loading...';
    }

    /*
     * A null count indicates an error occured while calling the backend
     * function. The page will simply display an error string in this case.
     */
    if (this.state.count === null) {
      return 'Error';
    }

    return (
      <div className="Counter">
        <div className="count">{this.state.count}</div>
        <button className="increment" onClick={this.increment}>
          +1
        </button>
      </div>
    );
  }
}

ReactDOM.render(<Counter/>, document.getElementById('root'));
