define([
	'namespace',
	'getNativeObject'
], function (namespace, getNativeObject) {

	namespace.Date = getNativeObject('Date');

	return namespace.Date;
});