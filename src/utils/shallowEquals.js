// From react-redux but adapted to match more deeply and to match functions

const hasOwn = Object.prototype.hasOwnProperty

function is(x, y) {
	if (x === y) {
		return x !== 0 || y !== 0 || 1 / x === 1 / y
	} else if (typeof x === 'function' && typeof y === 'function') {
		return x.toString() === y.toString()
	} else {
		return x !== x && y !== y // eslint-disable-line no-self-compare
	}
}

function objectMatch(objA, objB) {
	const keysA = Object.keys(objA)
	const keysB = Object.keys(objB)

	if (keysA.length !== keysB.length) {
		return false
	}

	for (let i = 0; i < keysA.length; i++) {
		if (!hasOwn.call(objB, keysA[i])) {
			return false
		} else if (
			typeof objA[keysA[i]] === 'object' &&
			typeof objB[keysB[i]] === 'object'
		) {
			if (!objectMatch(objA[keysA[i]], objB[keysB[i]])) {
				return false
			}
		} else if (!is(objA[keysA[i]], objB[keysA[i]])) {
			return false
		}
	}

	return true
}

export default function shallowEqual(objA, objB) {
	if (is(objA, objB)) return true

	if (
		typeof objA !== 'object' ||
		objA === null ||
		typeof objB !== 'object' ||
		objB === null
	) {
		console.log(`Object type is wrong or null`)
		return false
	}

	return objectMatch(objA, objB)
}
