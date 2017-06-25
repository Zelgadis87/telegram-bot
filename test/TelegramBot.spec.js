
/* eslint-env mocha */

const chai = require( 'chai' )
	, chaiAsPromised = require( 'chai-as-promised' )
	, expect = chai.use( chaiAsPromised ).expect
	;

chai.should();

describe( 'TelegramBot', function() {

	let TelegramBot = require( '../src/TelegramBot.js' );

	describe( '#constructor', function() {

		it( 'should be invoked with a token', function() {
			expect( () => new TelegramBot() ).to.throw();
			expect( () => new TelegramBot( 'abc' ) ).to.not.throw();
		} );

	} );

	describe( 'API', function() {

		let nock = require( 'nock' )
			, bot
			, status = { id: -1, username: 'MockedTelegramBot' }
			, chat = {
				id: 3,
				first_name: "MockedUser",
				username: "mocked-user",
				type: "private"
			}
			, from = {
				id: 3,
				first_name: "MockedUser",
				username: "mocked-user",
				language_code: "en"
			}
			, message = {
				message_id: 1,
				from: from,
				chat: chat,
				date: 1498387983,
				text: "asd"
			}
			, fileInfo = { file_id: "BQADBAADqgEAAvO0gFJcJPDPb4dVSgI", file_size: 234, file_path: "documents/document.json" }
			;

		before( () => {
			nock.disableNetConnect();
			bot = new TelegramBot( '_token' );
		} );

		it( 'should be able to ask information about self', function() {

			nock( 'https://api.telegram.org' )
				.get( '/bot_token/getMe' )
				.reply( 200, { ok: true, result: status } );

			let promise = bot.getMe();

			return Promise.all( [
				promise.should.eventually.be.fulfilled,
				promise.should.eventually.have.property( 'id' ),
				promise.should.eventually.have.property( 'username' ),
				promise.should.eventually.become( status )
			] );

		} );

		it( 'should be able to fetch updates', function() {

			let update1 = {
				update_id: 1,
				message: message
			};
			let updates = [ update1 ];

			nock( 'https://api.telegram.org' )
				.get( '/bot_token/getUpdates' )
				.reply( 200, { ok: true, result: updates } );

			let promise = bot.getUpdates();

			return Promise.all( [
				promise.should.eventually.be.fulfilled,
				promise.should.eventually.be.an( 'array' ),
				promise.should.eventually.become( updates )
			] );

		} );

		it( 'should be able to send messages', function() {

			let reply = {
				ok: true,
				result: message
			};

			nock( 'https://api.telegram.org' )
				.post( '/bot_token/sendMessage', {
					chat_id: chat.id,
					text: message.text
				 } )
				.reply( 200, { ok: true, result: message } );

			let promise = bot.sendMessage( chat.id, message.text );

			return Promise.all( [
				promise.should.eventually.be.fulfilled,
				promise.should.eventually.be.become( message )
			] );

		} );

		it( 'should be able to fetch attachment information', function() {

			nock( 'https://api.telegram.org' )
				.get( '/bot_token/getFile' )
				.reply( 200, { ok: true, result: fileInfo } );

			let promise = bot.getFileInfo( fileInfo.id );

			return Promise.all( [
				promise.should.eventually.be.fulfilled,
				promise.should.eventually.have.property( 'file_id' ),
				promise.should.eventually.have.property( 'file_size' ),
				promise.should.eventually.have.property( 'file_path' ),
				promise.should.eventually.become( fileInfo )
			] );

		} );

		it( 'should be able to retrieve attachments', function() {

			nock( 'https://api.telegram.org' )
				.get( '/file/bot_token/' + fileInfo.file_path )
				.reply( 200, 'file_data' );

			let promise = bot.downloadFile( fileInfo.file_path );

			return Promise.all( [
				promise.should.eventually.be.fulfilled,
				promise.should.eventually.become( new Buffer( 'file_data' ) )
			] );

		} );

	} );

} );