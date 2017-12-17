import identity from '../utils/identity'
const connectFactory = Provider => (
	stateToProps = identity,
	dispatchToProps = identity
) => Component => {
	const updateFromStore = function(vnode) {
		const { state } = vnode
		state.props = Object.assign(
			{},
			state.props || {},
			dispatchToProps(Provider.store.dispatch, state.props),
			stateToProps(Provider.store.getState(), state.props)
		)
	}
	const handleSubscription = function() {
		updateFromStore(this)
		Provider.mithril.redraw()
	}
	if (Component.prototype && typeof Component.prototype.view === 'function') {
		if (typeof Component.prototype.oninit === 'function') {
			Component.prototype._preconnect_oninit = Component.prototype.oninit
		} else {
			Component.prototype._preconnect_oninit = _ => {}
		}
		Component.prototype.oninit = function(vnode) {
			this._preconnect_oninit(vnode)
			updateFromStore(vnode)
			Provider.store.subscribe(handleSubscription.bind(vnode))
		}
	} else if (typeof Component.view === 'function') {
		if (typeof Component.oninit === 'function') {
			Component._preconnect_oninit = Component.oninit
		} else {
			Component._preconnect_oninit = _ => {}
		}
		Component.oninit = function(vnode) {
			vnode.state._preconnect_oninit(vnode)
			updateFromStore(vnode)
			Provider.store.subscribe(handleSubscription.bind(vnode))
		}
	} else {
		throw new Error(`${Component} is not a valid Mithril Component`)
	}
	return Component
}

export default connectFactory
