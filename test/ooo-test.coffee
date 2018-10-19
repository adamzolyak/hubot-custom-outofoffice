chai = require 'chai'
sinon = require 'sinon'
chai.use require 'sinon-chai'

expect = chai.expect

Robot = require('hubot').Robot
TextMessage = require('hubot').TextMessage

describe 'Out of Office', ->
  beforeEach (done) ->
    @robot = new Robot(null, 'mock-adapter', false, 'jarvis')

    @robot.adapter.on 'connected', =>
      process.env.HUBOT_AUTH_ADMIN = '1'

      require('../scripts/ooo') @robot

      @user1 = @robot.brain.userForId('1', name: 'jasmine', room: '#jasmine')
      @user2 = @robot.brain.userForId('2', name: 'mike', room: '#jasmine', ooo: '')
      @user3 = @robot.brain.userForId('3', name: 'david', room: '#jasmine', ooo: 'dawg')
      @adapter = @robot.adapter
      done()

    @robot.run()

  afterEach ->
    @robot.shutdown()

  describe '#enable ooo', ->
    describe 'enable ooo without custom message', ->
      it 'will enable ooo without a custom message', (done) ->
        onReply = @spy (envelope, strings) ->
          expect(strings[0]).to.contain(['out of office enabled'])

          done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user1, 'jarvis enable ooo'))

    describe 'enable ooo with custom message', ->
      it 'will enable ooo with a custom message', (done) ->
        onReply = @spy (envelope, strings) ->
          expect(strings[0]).to.contain(['out of office enabled with message "gone fishin"'])

          done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user1, 'jarvis enable ooo gone fishin'))

    describe 'enable ooo with custom message with special characters', ->
      it 'will enable ooo with a custom message with special characters', (done) ->
        onReply = @spy (envelope, strings) ->
          expect(strings[0]).to.contain(['out of office enabled with message "`~!@#$%^&*()_+-={}|[]\\:";\'<>?,./"'])

          done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user1, 'jarvis enable ooo `~!@#$%^&*()_+-={}|[]\\:";\'<>?,./'))

  describe '#disable ooo', ->
    describe 'disable ooo for user with ooo enabled without a custom message', ->
      it 'will disable ooo', (done) ->
        onReply = @spy (envelope, strings) ->
          expect(strings[0]).to.contain(['out of office disabled'])

          done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user2, 'jarvis disable ooo'))

    describe 'disable ooo for user with ooo enabled with a custom message', ->
      it 'will disable ooo', (done) ->
        onReply = @spy (envelope, strings) ->
          expect(strings[0]).to.contain(['out of office disabled'])

          done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user3, 'jarvis disable ooo'))

    describe 'disable ooo for user with ooo disabled', ->
      it 'will disable ooo', (done) ->
        onReply = @spy (envelope, strings) ->
          expect(strings[0]).to.contain(['out of office wasn\'t enabled'])

          done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user1, 'jarvis disable ooo'))

  describe '#trigger ooo', ->
    describe 'trigger ooo for non existent user', ->
      #todo - not sure how to test this given that the expected outcome is there is no message reply

    describe 'trigger ooo for user with ooo enabled without a custom message', ->
      it 'reply with ooo', (done) ->
        count = 0
        onReply = @spy (envelope, strings) ->
          count++

          expect(strings[0]).to.contain(['is out of office'])

          if (count == 9)
            done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user2, 'Where is @mike?'))
        @adapter.receive(new TextMessage(@user2, 'Where is @mike ?'))
        @adapter.receive(new TextMessage(@user2, 'Where is @mike today?'))
        @adapter.receive(new TextMessage(@user2, '@mike are you there?'))
        @adapter.receive(new TextMessage(@user2, 'Thanks @mike'))
        @adapter.receive(new TextMessage(@user2, 'Thanks @mike '))
        @adapter.receive(new TextMessage(@user2, '@mike'))
        @adapter.receive(new TextMessage(@user2, ' @mike'))
        @adapter.receive(new TextMessage(@user2, ' @mike '))

    describe 'trigger ooo for user with ooo enabled with a custom message', ->
      it 'reply with ooo', (done) ->
        count = 0
        onReply = @spy (envelope, strings) ->
          count++

          expect(strings[0]).to.contain(['is out of office \"dawg\"'])

          if (count == 9)
            done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user3, 'Where is @david?'))
        @adapter.receive(new TextMessage(@user3, 'Where is @david ?'))
        @adapter.receive(new TextMessage(@user3, 'Where is @david today?'))
        @adapter.receive(new TextMessage(@user3, '@david are you there?'))
        @adapter.receive(new TextMessage(@user3, 'Thanks @david'))
        @adapter.receive(new TextMessage(@user3, 'Thanks @david '))
        @adapter.receive(new TextMessage(@user3, '@david'))
        @adapter.receive(new TextMessage(@user3, ' @david'))
        @adapter.receive(new TextMessage(@user3, ' @david '))

  describe '#check ooo', ->
    describe 'check ooo for user without ooo enabled', ->
      it 'reply that the user does not have an ooo enabled', (done) ->
        onReply = @spy (envelope, strings) ->
          expect(strings[0]).to.contain(['you do not have an out of office enabled'])

          done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user1, 'jarvis check ooo'))

    describe 'check ooo for user with ooo enabled without a custom message', ->
      it 'reply that the user does not have an ooo enabled', (done) ->
        onReply = @spy (envelope, strings) ->
          expect(strings[0]).to.contain(['you have an out of office enabled with no custom message'])

          done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user2, 'jarvis check ooo'))

    describe 'check ooo for user with ooo enabled with a custom message', ->
      it 'reply that the user does not have an ooo enabled', (done) ->
        onReply = @spy (envelope, strings) ->
          expect(strings[0]).to.contain(['you have an out of office enabled with custom message \"dawg\"'])

          done()

        @adapter.on 'reply', onReply
        @adapter.receive(new TextMessage(@user3, 'jarvis check ooo'))


