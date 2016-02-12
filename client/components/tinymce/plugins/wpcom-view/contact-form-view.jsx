/**
 * External dependencies
 */
import React from 'react';
import { deserialize } from '../contact-form/shortcode-utils';
/**
 * Internal dependecies
 */
import shortcodeUtils from 'lib/shortcode';

export default React.createClass( {
	statics: {
		match( content ) {
			const match = shortcodeUtils.next( 'contact-form', content );

			if ( match ) {
				return {
					index: match.index,
					content: match.content,
					options: {
						shortcode: match.shortcode
					}
				};
			}
		},

		serialize( content ) {
			return encodeURIComponent( content );
		},

		edit( editor, content ) {
			editor.execCommand( 'wpcomContactForm', content );
		}
	},

	renderContent() {
		const required = required => required ? <em>&nbsp;({ this.translate( 'required' ) })</em> : null;
		const textField = ( field, index ) => {
			return (
				<fieldset key={ 'contact-form-field-' + index } className="wpview-type-contact-form-field">
					<legend>{ field.label }{ required( field.required ) }</legend>
					<input type="text" />
				</fieldset>
			);
		};
		const textarea = ( field, index ) => {
			return (
				<fieldset key={ 'contact-form-field-' + index } className="wpview-type-contact-form-field">
					<legend>{ field.label }{ required( field.required ) }</legend>
					<textarea></textarea>
				</fieldset>
			);
		};
		const checkbox = ( field, index ) => {
			return (
				<fieldset key={ 'contact-form-field-' + index } className="wpview-type-contact-form-field">
					<label><input type="checkbox" />{ field.label }{ required( field.required ) }</label>
				</fieldset>
			);
		};
		const dropdown = ( field, index ) => {
			return (
				<fieldset key={ 'contact-form-field-' + index } className="wpview-type-contact-form-field">
					<legend>{ field.label }{ required( field.required ) }</legend>
					<select>
						{ field.options.map( ( option, index ) => (
							<option key={ 'contact-form-select-option-' + index }>{ option }</option>
						) ) }
					</select>
				</fieldset>
			);
		}
		const radio = ( field, index ) => {
			return (
				<fieldset key={ 'contact-form-field-' + index } className="wpview-type-contact-form-field">
					<legend>{ field.label }{ required( field.required ) }</legend>
						{ field.options.map( ( option, index ) => (
							<label key={ 'contact-form-radio-' + index }><input type="radio" /><span>{ option }</span></label>
						) ) }
				</fieldset>
			);
		}

		const renderField = {
			name: textField,
			email: textField,
			url: textField,
			text: textField,
			textarea,
			checkbox,
			dropdown
		};

		const { fields } = deserialize( this.props.content );
		if ( fields && Array.isArray( fields ) ) {
			return fields.map( ( field, index ) => field.type in renderField ? renderField[field.type]( field, index ) : null )
		}

		return null;
	},

	render() {
		return (
			<div className="wpview-content wpview-type-contact-form">
				{ this.renderContent() }
				<button disabled>{ this.translate( 'Submit' ) }</button>
			</div>
		);
	}
} );
