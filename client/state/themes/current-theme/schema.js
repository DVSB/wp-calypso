export default {
	type: 'object',
	properties: {
		isActivating: { type: 'boolean' },
		hasActivated: { type: 'boolean' },
		currentThemes: {
			type: 'object',
			patternProperties: {
				//be careful to escape regexes properly
				'^\\d+$': {
					properties: {
						name: { type: 'string' },
						id: { type: 'string' },
						cost: { type: 'object' }
					}
				}
			},
			additionalProperties: false
		}
	}
};
