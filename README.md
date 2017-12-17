[![npm version](https://badge.fury.io/js/mithril-redux.svg)](https://badge.fury.io/js/mithril-redux)

# Mithril Redux
This package provides utilites for working with Redux within a Mithril application. It works almost exactly like `react-redux`.

It subscribes to the store and sets `state.props` to values provided by two mapping functions, one that maps `state` and the other that maps `dispatch`.

It does not rely on you using the `mjsx` Babel plugin.

This is a mostly complete rewrite of [colinbate/mithril-redux](https://github.com/colinbate/mithril-redux), which was compatible with Mithril 0.2. The new version changes the API for `connect()` (making it work like `react-redux`) and also makes the library compatible with Mithril 1.0.

## Usage

Install with:

    npm install --save mithril-redux

## API

### `Provider.init(store, mithril, component)`

When you are mounting your app, you should call this function to initialize the link between your store and Mithril.

The parameters are the Redux store, then the mithril (`m`) object, and then an optional mithril component. If the component is a function is it instantiated and returned, otherwise it is returned as-is.

#### Example

```js
import m from 'mithril';
import {Provider} from 'mithril-redux';
import configStore from './store';
import Root from './root';

const store = configStore({name: 'World', age: 30});

m.mount(document.body, Provider.init(store, m, Root));
```

### `connect(mapStateToProps, mapDispatchToProps)(component)`

Used to turn your Mithril components into Redux-aware Mithril components. Works similar to `connect` from `react-redux`.

* `mapStateToProps` - A function which provides the result of `store.getState()` and the component's own `state.props` variable and returns a list of props to add to the component's `state.props`. This function is generally used for connecting store values to component props.
* `mapDispatchToProps` - A function which provides `store.dispatch` and the component's own `state.props` variable and returns a list of props to add to the component's `state.props`. This function is generally used to connect action creators to Redux's `dispatch` function. 
* `component` - The Mithril component to connect.

#### Example

```js
import {connect} from 'mithril-redux';
import {bindActionCreators} from 'redux'
import {incrementAge, decrementAge, resetAge} from './actions';

const AgeBox = {
	view: function(vnode) {
		const {state} = vnode;
		return m('div', [
			m('span', 'Age: ' + state.props.age),
			m('button', {onclick: state.props.actions.dec}, 'Younger'),
			m('button', {onclick: state.props.actions.inc}, 'Older'),
			m('button', {onclick: state.props.actions.reset}, 'Reset')
		]);	
	}
}

const mapStateToProps = state => ({
	age: state.age
})
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({incrementAge, decrementAge, resetAge}, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(AgeBox);
```

## Changes to 2.0.0

* `connect` now accepts two functions as its first two parameters:
	* One that maps from `store.getState()` to `state.props`
	* One that maps from `store.dispatch` to `state.props`
* The component will now be subscribed to the redux store, rather than just get updates as part of the component's own lifecycle.