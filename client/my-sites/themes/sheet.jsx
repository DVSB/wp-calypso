/** @ssr-ready **/

/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import { getThemeDetails } from 'state/themes/theme-details/selectors';

export const ThemeSheet = React.createClass( {
	displayName: 'ThemeSheet',

	propTypes: {
		themeSlug: React.PropTypes.string,
	},

	render() {
		return (
			<Main className="themes__sheet">
				<div className="themes__sheet-bar">
					<span className="themes__sheet-bar-title">{ this.props.theme.name }</span>
					<span className="themes__sheet-bar-tag">by { this.props.theme.author }</span>
				</div>
				<div className="themes__sheet-screenshot">
					<img className="themes__sheet-img" src="https://i2.wp.com/theme.wordpress.com/wp-content/themes/pub/orvis/screenshot.png?w=680" />
				</div>
			</Main>
		);
	}
} )

export default connect(
	( state, props ) => Object.assign( {},
		props,
		{
			theme: getThemeDetails( state, props.themeSlug ),
		}
	)
)( ThemeSheet );
