/**
 * External dependencies
 */
import moment from 'moment';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import { getLocalForage } from 'lib/localforage';

/**
 * Module variables
 */
const localforage = getLocalForage();
const debug = debugFactory( 'calypso:sync-handler:cache' );
const RECORDS_LIST_KEY = 'records-list';
const LIFETIME = 1000 * 60 * 60 * 24;

export class CacheInvalidation {
	getAll( fn = () => {} ) {
		return localforage.getItem( RECORDS_LIST_KEY, fn );
	}

	/**
	 * Add the given `key` into the cache-invalidation object
	 * adding at the same a marktime (now).
	 * If the pair key-mark already exists it will be updated.
	 *
	 * @param {String} key - record key
	 * @return {Promise} promise
	 */
	addItem( key, fn = () => {} ) {
		return this.filterByKey( key, ( err, records = [] ) => {
			debug( 'adding %o', key );

			// add the fresh item into history list
			records.unshift( { key, mark: new Date() } );
			return localforage.setItem( RECORDS_LIST_KEY, records, fn );
		},
		err => {
			fn( err );
		} );
	}

	removeItem( key, fn = () => {} ) {
		return this.filterByKey().then(
			key, records => {
				debug( 'adding %o', key );
				return localforage.setItem( RECORDS_LIST_KEY, records, fn );
			},
			err => {
				fn( err );
			}
		);
	}

	cleanAll( fn = () => {} ) {
		return localforage.removeItem( RECORDS_LIST_KEY, fn );
	}

	/**
	 * retrieve all records filter by the given key
	 *
	 * @param {String} key - compare records with this key
	 * @param {Function} [fn] - callback function
	 * @return {Promise} promise
	 */
	filterByKey( key, fn = () => {} ) {
		let changed = false;
		return this.getAll().then( records => {
			if ( ! records || ! records.length ) {
				debug( 'No records stored' );
				return fn( null, [] );
			}

			// filter records by the given key
			records = records.filter( item => {
				if ( item.key === key ) {
					debug( '%o key exists. Removing ...', key );
					changed = true;
				}
				return item.key !== key;
			} );

			return fn( null, records, changed );
		} );
	}

	pruneRecordsFrom( lifetime = LIFETIME ) {
		let updateRecords = false;

		this.getAll()
		.then( records => {
			if ( ! records || ! records.length ) {
				return debug( 'Records not found' );
			}

			records = records.filter( item => {
				let reference = +new Date() - lifetime;
				let timeago = moment( item.mark ).from();
				if ( +item.mark < reference ) {
					debug( '%o key is too old (created %s). Removing ...', item.key, timeago );
					localforage.removeItem( item.key );
					updateRecords = true;
					return false;
				}

				return true;
			} );

			if ( updateRecords ) {
				debug( 'updating cache-invalidation data' );
				return localforage.setItem( RECORDS_LIST_KEY, records );
			}
		} );
	}
}
