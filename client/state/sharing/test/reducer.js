/**
 * External dependencies
 */
import { expect } from 'chai';
import sinon from 'sinon';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	DESERIALIZE,
	SERIALIZE
} from 'state/action-types';
import reducer from '../reducer';

describe( '#publicize()', () => {
	describe( 'persistence', () => {
		var validState, initialState;
		before( () => {
			validState = deepFreeze( {
				publicize: {
					fetchingConnections: {
						1: false,
						2: false
					},
					connections: {
						1: { ID: 1, site_ID: 2916284 },
						2: { ID: 2, site_ID: 2916284 }
					},
					connectionsBySiteId: {
						2916284: [ 1, 2 ]
					}
				}
			} );
			initialState = reducer( undefined, { type: DESERIALIZE } );
			sinon.stub( console, 'warn' );
		} );
		after( () => {
			console.warn.restore();
		} );
		it( 'should load valid persisted data', () => {
			const state = reducer( validState, {
				type: DESERIALIZE
			} );
			expect( state ).to.eql( validState );
		} );

		it( 'should ignore loading data with invalid keys', () => {
			const persistedState = deepFreeze( Object.assign( {}, validState,
				{ publicize: { connections: { foo: { } } } } ) );
			const state = reducer( persistedState, {
				type: DESERIALIZE
			} );
			expect( state ).to.eql( initialState );
		} );

		it( 'should ignore loading data with invalid values', () => {
			const persistedState = deepFreeze( Object.assign( {}, validState,
				{ publicize: { connections: { 1: { ID: 'foo', site_ID: 2916284 } } } } ) );
			const state = reducer( persistedState, {
				type: DESERIALIZE
			} );
			expect( state ).to.eql( initialState );
		} );

		it( 'should persist data', () => {
			const persistedState = reducer( validState, {
				type: SERIALIZE
			} );
			expect( persistedState ).to.eql( validState );
		} );
	} );
} );
