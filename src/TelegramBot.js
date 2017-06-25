
const API_URL = 'https://api.telegram.org';

let rp = require( 'request-promise' )
	, getResult = x => x.result
	;

const tokenSymbol = Symbol( 'token' );

class TelegramBot {

	constructor( token ) {
		if ( !token )
			throw Error( 'Token missing' );
		this[ tokenSymbol ] = token;
	}

	getMe() {
		return rp( `${API_URL}/bot${this[tokenSymbol]}/getMe`, {
			json: true
		} ).then( getResult );
	}

	getUpdates( offset, limit ) {
		return rp( `${API_URL}/bot${this[tokenSymbol]}/getUpdates`, {
			json: true,
			body: {
				offset: offset,
				limit: limit
			}
		} ).then( getResult );
	}

	sendMessage( chatId, text, options ) {
		return rp( `${API_URL}/bot${this[tokenSymbol]}/sendMessage`, {
			method: 'POST',
			json: true,
			body: Object.assign( {}, options, {
				chat_id: chatId,
				text: text
			} )
		} ).then( getResult );
	}

	getFileInfo( fileId ) {
		return rp( `${API_URL}/bot${this[tokenSymbol]}/getFile`, {
			json: true,
			body: {
				file_id: fileId
			}
		} ).then( getResult );
	}

	downloadFile( filePath ) {
		return rp( `${API_URL}/file/bot${this[tokenSymbol]}/${filePath}`, {
			encoding: null
		} );
	}

}

module.exports = TelegramBot;
