export default class _Provider {
	init(store, mithril, Component) {
		this.store = store
		this.mithril = mithril
		const comp = typeof Component === 'function' ? new Component() : Component
		return comp
	}
}
