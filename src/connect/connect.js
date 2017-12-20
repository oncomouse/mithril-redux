import identity from '../utils/identity'
import shallowEquals from '../utils/shallowEquals'

const connectFactory = Provider => (
	stateToProps = identity,
	dispatchToProps = identity
) => Component => {
	const updateFromStore = function(vnode) {
		const { state } = vnode
		const newProps = Object.assign(
			{},
			state.props || {},
			dispatchToProps(Provider.store.dispatch, state.props),
			stateToProps(Provider.store.getState(), state.props)
		)
		if (!shallowEquals(newProps, state.props || {})) {
			state.props = newProps
		}
	}
	const handleSubscription = function() {
		updateFromStore(this)
		Provider.mithril.redraw()
	}
	const newOninit = function() {
		return function(vnode) {
			vnode.state._preconnect_oninit(vnode)
			updateFromStore(vnode)
			vnode.state.unsubscribe = Provider.store.subscribe(
				handleSubscription.bind(vnode)
			)
		}
	}
	const newOnremove = function() {
		return function(vnode) {
			vnode.state._preconnect_onremove()
			vnode.state.unsubscribe()
		}
	}
	if (Component.prototype && typeof Component.prototype.view === 'function') {
		if (typeof Component.prototype.oninit === 'function') {
			Component.prototype._preconnect_oninit = Component.prototype.oninit
		} else {
			Component.prototype._preconnect_oninit = () => {}
		}
		if (typeof Component.prototype.onremove === 'function') {
			Component.prototype._preconnect_onremove = Component.prototype.oninit
		} else {
			Component.prototype._preconnect_onremove = () => {}
		}
		Component.prototype.oninit = newOninit()
		Component.prototype.onremove = newOnremove()
	} else if (typeof Component.view === 'function') {
		if (typeof Component.oninit === 'function') {
			Component._preconnect_oninit = Component.oninit
		} else {
			Component._preconnect_oninit = () => {}
		}
		if (typeof Component.onremove === 'function') {
			Component._preconnect_onremove = Component.oninit
		} else {
			Component._preconnect_onremove = () => {}
		}
		Component.oninit = newOninit()
		Component.onremove = newOnremove()
	} else {
		throw new Error(`${Component} is not a valid Mithril Component`)
	}
	return Component
}

export default connectFactory
