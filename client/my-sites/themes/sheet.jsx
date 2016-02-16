/** @ssr-ready **/

/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import page from 'page';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import Gridicon from 'components/gridicon';
import HeaderCake from 'components/header-cake';
import Button from 'components/button';
import { purchase, customize, activate, signup } from 'state/themes/actions';
import { getThemeById } from 'state/themes/themes/selectors';
import { getSelectedSite } from 'state/ui/selectors';
import ThemeHelpers from 'my-sites/themes/helpers';
import i18n from 'lib/mixins/i18n';

export const ThemeSheet = React.createClass( {
	displayName: 'ThemeSheet',

	propTypes: {
		themeSlug: React.PropTypes.string,
	},

	getDefaultProps() {
		return {
			theme: {
				price: '$125',
			}
		};
	},

	onBackClick() {
		page.back();
	},

	onPrimaryClick() {
		let action;

		if ( ThemeHelpers.isPremium( this.props.theme ) && ! this.props.theme.purchased && this.props.isLoggedIn ) {
			action = purchase( this.props.theme, this.props.selectedSite, 'showcase-sheet' );
		} else if ( this.props.theme.active ) {
			action = customize( this.props.theme, this.props.selectedSite );
		} else if ( this.props.isLoggedIn ) {
			action = activate( this.props.theme, this.props.selectedSite, 'showcase-sheet' );
		} else {
			action = signup( this.props.theme );
		}

		this.props.dispatch( action );
	},

	render() {
		let actionTitle;
		if ( this.props.isLoggedIn && this.props.theme.active ) {
			actionTitle = i18n.translate( 'Customize' );
		} else if ( this.props.isLoggedIn ) {
			actionTitle = ThemeHelpers.isPremium( this.props.theme ) && ! this.props.theme.purchased
				? i18n.translate( 'Purchase & Activate' )
				: i18n.translate( 'Activate' );
		} else {
			actionTitle = i18n.translate( 'Start with this design' );
		}

		return (
			<Main className="themes__sheet">
				<div className="themes__sheet-bar">
					<span className="themes__sheet-bar-title">Pineapple Fifteen</span>
					<span className="themes__sheet-bar-tag">by Alpha and Omega</span>
				</div>
				<HeaderCake className="themes__sheet-action-bar" onClick={ this.onBackClick }>
					<div className="themes__sheet-action-bar-container">
						<span className="themes__sheet-action-bar-cost">{ this.props.theme.price }</span>
						<Button secondary >{ i18n.translate( 'Download' ) }</Button>
						<Button primary icon onClick={ this.onPrimaryClick }><Gridicon icon="checkmark"/>{ actionTitle }</Button>
					</div>
				</HeaderCake>
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
			theme: getThemeById( state, props.themeSlug ),
			selectedSite: getSelectedSite( state ) || false,
		}
	)
)( ThemeSheet );
