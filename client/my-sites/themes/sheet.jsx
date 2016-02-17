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
import SectionNav from 'components/section-nav';
import NavTabs from 'components/section-nav/tabs';
import NavItem from 'components/section-nav/item';
import Card from 'components/card';
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
				description_long: `
Kitsch four loko deep v, tousled kombucha polaroid gentrify. Kitsch bushwick mixtape, ugh wayfarers artisan YOLO godard direct trade. Post-ironic YOLO helvetica, hammock small batch man bun gastropub ethical forage. Neutra retro swag, chambray polaroid deep v distillery microdosing messenger bag pabst narwhal bitters. Fingerstache retro banh mi mixtape pabst. Tote bag cred everyday carry meh ennui leggings. Austin truffaut marfa, deep v artisan kickstarter fingerstache gentrify typewriter aesthetic meditation pop-up.

Man braid meditation meggings art party occupy kale chips, raw denim aesthetic pop-up portland cred. Cold-pressed godard authentic beard offal, quinoa butcher photo booth. Literally messenger bag waistcoat cliche taxidermy, austin knausgaard freegan. Seitan master cleanse skateboard, pickled mixtape YOLO before they sold out ugh. Authentic actually ethical fanny pack squid, flannel kale chips YOLO humblebrag polaroid franzen. Pitchfork flannel mumblecore food truck. Craft beer fap 90's, heirloom shabby chic typewriter salvia listicle pabst beard tacos sustainable yuccie.`
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
						<div className="themes__sheet-screenshot">
							<img className="themes__sheet-img" src="https://i2.wp.com/theme.wordpress.com/wp-content/themes/pub/orvis/screenshot.png?w=680" />
						</div>
					</div>
				</HeaderCake>
				<div className="themes__sheet-content-column">
					<SectionNav className="themes__sheet-section-nav">
						<NavTabs label="Details" selectedText="Details">
							<NavItem path={ `/themes/${ this.props.theme.id }/details` } selected >Details</NavItem>
							<NavItem path={ `/themes/${ this.props.theme.id }/documentation` }>Documentation</NavItem>
							<NavItem path={ `/themes/${ this.props.theme.id }/support` }>Support</NavItem>
						</NavTabs>
					</SectionNav>
					<Card className="themes__sheet-content">{ this.props.theme.description_long }</Card>
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
