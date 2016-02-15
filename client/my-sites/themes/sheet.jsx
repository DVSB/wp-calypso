/** @ssr-ready **/

/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import Main from 'components/main';

export const ThemeSheet = React.createClass( {
	displayName: 'ThemeSheet',

	propTypes: {
		name: React.PropTypes.string,
		author: React.PropTypes.string,
		screenshot: React.PropTypes.string,
	},

	render() {
		return (
			<Main className="themes__sheet">
				<div className="themes__sheet-bar">
					<span className="themes__sheet-bar-title">{ this.props.name }</span>
					<span className="themes__sheet-bar-tag">by { this.props.author }</span>
				</div>
				<div className="themes__sheet-screenshot">
					<img className="themes__sheet-img" src={ this.props.screenshot + '?=w680' } />
				</div>
			</Main>
		);
	}
} )
