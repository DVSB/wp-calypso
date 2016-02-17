/**
 * External dependencies
 */
var React = require( 'react' ),
	{ connect } = require( 'react-redux' ),
	{ bindActionCreators } = require( 'redux' );

/**
 * Internal dependencies
 */
var StoreConnection = require( 'components/data/store-connection' ),
	CartStore = require( 'lib/cart/store' ),
	{ setSection } = require( 'state/ui/actions' ),
	{ abtest } = require( 'lib/abtest' );

var stores = [ CartStore ];

function getStateFromStores() {
	return {
		cart: CartStore.get()
	};
}

const CartData = React.createClass( {
	componentWillMount: function() {
		this.updateSidebarVisibility();
	},

	componentDidMount: function() {
		CartStore.on( 'change', this.updateSidebarVisibility );
	},

	componentWillUnmount: function() {
		CartStore.off( 'change', this.updateSidebarVisibility );
	},

	updateSidebarVisibility: function() {
		const cart = CartStore.get(),
			oneProductToCheckout = cart.hasLoadedFromServer && cart.products.length === 1;

		if ( abtest( 'sidebarOnCheckoutOfOneProduct' ) === 'original' ) {
			return;
		}

		this.props.setSection( null, { hasSidebar: ! oneProductToCheckout } );
	},

	render: function() {
		return (
			<StoreConnection stores={ stores } getStateFromStores={ getStateFromStores }>
				{ this.props.children }
			</StoreConnection>
		);
	}
} );

export default connect(
	null,
	dispatch => bindActionCreators( { setSection }, dispatch )
)( CartData );
