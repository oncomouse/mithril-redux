(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['Mithril Redux'] = {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var _Provider = function () {
	function _Provider() {
		classCallCheck(this, _Provider);
	}

	_Provider.prototype.init = function init(store, mithril, Component) {
		this.store = store;
		this.mithril = mithril;
		var comp = typeof Component === 'function' ? new Component() : Component;
		return comp;
	};

	return _Provider;
}();

var identity = (function (x) {
  return x;
});

// From react-redux but adapted to match more deeply and to match functions

var hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
	if (x === y) {
		return x !== 0 || y !== 0 || 1 / x === 1 / y;
	} else if (typeof x === 'function' && typeof y === 'function') {
		return x.toString() === y.toString();
	} else {
		return x !== x && y !== y; // eslint-disable-line no-self-compare
	}
}

function objectMatch(objA, objB) {
	var keysA = Object.keys(objA);
	var keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (var i = 0; i < keysA.length; i++) {
		if (!hasOwn.call(objB, keysA[i])) {
			return false;
		} else if (_typeof(objA[keysA[i]]) === 'object' && _typeof(objB[keysB[i]]) === 'object') {
			if (!objectMatch(objA[keysA[i]], objB[keysB[i]])) {
				return false;
			}
		} else if (!is(objA[keysA[i]], objB[keysA[i]])) {
			return false;
		}
	}

	return true;
}

function shallowEqual(objA, objB) {
	if (is(objA, objB)) return true;

	if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
		console.log('Object type is wrong or null');
		return false;
	}

	return objectMatch(objA, objB);
}

var connectFactory = function connectFactory(Provider) {
	return function () {
		var stateToProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
		var dispatchToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
		return function (Component) {
			var updateFromStore = function updateFromStore(vnode) {
				var state = vnode.state;

				var newProps = Object.assign({}, state.props || {}, dispatchToProps(Provider.store.dispatch, state.props), stateToProps(Provider.store.getState(), state.props));
				if (!shallowEqual(newProps, state.props || {})) {
					state.props = newProps;
				}
			};
			var handleSubscription = function handleSubscription() {
				updateFromStore(this);
				Provider.mithril.redraw();
			};
			var newOninit = function newOninit() {
				return function (vnode) {
					vnode.state._preconnect_oninit(vnode);
					updateFromStore(vnode);
					vnode.state.unsubscribe = Provider.store.subscribe(handleSubscription.bind(vnode));
				};
			};
			var newOnremove = function newOnremove() {
				return function (vnode) {
					vnode.state._preconnect_onremove();
					vnode.state.unsubscribe();
				};
			};
			if (Component.prototype && typeof Component.prototype.view === 'function') {
				if (typeof Component.prototype.oninit === 'function') {
					Component.prototype._preconnect_oninit = Component.prototype.oninit;
				} else {
					Component.prototype._preconnect_oninit = function () {};
				}
				if (typeof Component.prototype.onremove === 'function') {
					Component.prototype._preconnect_onremove = Component.prototype.oninit;
				} else {
					Component.prototype._preconnect_onremove = function () {};
				}
				Component.prototype.oninit = newOninit();
				Component.prototype.onremove = newOnremove();
			} else if (typeof Component.view === 'function') {
				if (typeof Component.oninit === 'function') {
					Component._preconnect_oninit = Component.oninit;
				} else {
					Component._preconnect_oninit = function () {};
				}
				if (typeof Component.onremove === 'function') {
					Component._preconnect_onremove = Component.oninit;
				} else {
					Component._preconnect_onremove = function () {};
				}
				Component.oninit = newOninit();
				Component.onremove = newOnremove();
			} else {
				throw new Error(Component + ' is not a valid Mithril Component');
			}
			return Component;
		};
	};
};

// Generate the Provider component:
var Provider = new _Provider();
// Generate a connected connect() function:
var connect = connectFactory(Provider);

exports.Provider = Provider;
exports.connect = connect;

Object.defineProperty(exports, '__esModule', { value: true });

})));
