
// Configuration
const API_URL = 'https://api.telegram.org';

// Imports
const rp = require( 'request-promise' );

function TelegramBot( token ) {

	// Validation
	if ( !token )
		throw Error( 'Token missing' );

	// Implementation

	let apiCall = ( path, method, options ) =>
		rp( `${ API_URL }/${ path }/${ method }`, options );

	let fileApiCall = ( method, options ) =>
		apiCall( 'file/bot' + token, method, Object.assign( { encoding: null }, options ) );

	let jsonApiCall = ( method, options ) =>
		apiCall( 'bot' + token, method, Object.assign( { json: true }, options ) ).then( x => x.result );

	let getMe = () => jsonApiCall( 'getMe' );

	let getUpdates = ( offset, limit ) =>
		jsonApiCall( 'getUpdates', {
			body: {
				offset: offset,
				limit: limit
			}
		} );

	let sendMessage = ( chatId, text, options ) =>
		jsonApiCall( 'sendMessage', {
			method: 'POST',
			body: Object.assign( {}, options, {
				chat_id: chatId,
				text: text
			} )
		} );

	let getFileInfo = ( fileId ) =>
		jsonApiCall( 'getFile', {
			body: {
				file_id: fileId
			}
		} );

	let downloadFile = ( filePath ) =>
		fileApiCall( filePath );

	// Interface
	return {
		getMe: getMe,
		getUpdates: getUpdates,
		sendMessage: sendMessage,
		getFileInfo: getFileInfo,
		downloadFile: downloadFile
	};

}

module.exports = TelegramBot;
