import { registerFilter } from './filter-manager';

export const Filter = (name: string) => {
	return (constructor: Function) => {
		registerFilter(constructor.prototype);
		console.log(`Filter '${name}' registered`);
	};
};
