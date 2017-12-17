import _Provider from './components/_Provider'
import connectFactory from './connect/connect'

// Generate the Provider component:
const Provider = new _Provider()
// Generate a connected connect() function:
const connect = connectFactory(Provider)

export { Provider, connect }
