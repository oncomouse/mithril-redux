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

var connectFactory = function connectFactory(Provider) {
	return function () {
		var stateToProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : identity;
		var dispatchToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
		return function (Component) {
			var updateFromStore = function updateFromStore(vnode) {
				var state = vnode.state;

				state.props = Object.assign({}, state.props || {}, dispatchToProps(Provider.store.dispatch, state.props), stateToProps(Provider.store.getState(), state.props));
			};
			var handleSubscription = function handleSubscription() {
				updateFromStore(this);
				Provider.mithril.redraw();
			};
			if (Component.prototype && typeof Component.prototype.view === 'function') {
				if (typeof Component.prototype.oninit === 'function') {
					Component.prototype._preconnect_oninit = Component.prototype.oninit;
				} else {
					Component.prototype._preconnect_oninit = function (_) {};
				}
				Component.prototype.oninit = function (vnode) {
					this._preconnect_oninit(vnode);
					updateFromStore(vnode);
					Provider.store.subscribe(handleSubscription.bind(vnode));
				};
			} else if (typeof Component.view === 'function') {
				if (typeof Component.oninit === 'function') {
					Component._preconnect_oninit = Component.oninit;
				} else {
					Component._preconnect_oninit = function (_) {};
				}
				Component.oninit = function (vnode) {
					vnode.state._preconnect_oninit(vnode);
					updateFromStore(vnode);
					Provider.store.subscribe(handleSubscription.bind(vnode));
				};
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

export { Provider, connect };
