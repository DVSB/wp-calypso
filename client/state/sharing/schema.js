import {
	fetchingConnectionsSchema,
	connectionsSchema,
	connectionsBySiteIdSchema
} from './publicize/schema';

export const publicizeSchema = {
	type: 'object',
	properties: {
		publicize: {
			type: 'object',
			properties: {
				fetchingConnections: fetchingConnectionsSchema,
				connections: connectionsSchema,
				connectionsBySiteId: connectionsBySiteIdSchema
			}
		}
	}
};
