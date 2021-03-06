const expect = require('chai').expect
const { spy } = require('sinon');
const { Robot } = require('hubot');
const { TextMessage } = require('hubot');

describe('Out of Office', function() {
  beforeEach(function(done) {
    robot = new Robot(null, 'mock-adapter', false, 'jarvis');

    robot.adapter.on('connected', () => {
      process.env.HUBOT_AUTH_ADMIN = '1';

      require('../src/outofoffice')(robot);

      user1 = robot.brain.userForId('1', {name: 'jasmine', room: '#jasmine'});
      user2 = robot.brain.userForId('2', {name: 'mike', room: '#jasmine', ooo: ''});
      user3 = robot.brain.userForId('3', {name: 'david', room: '#jasmine', ooo: 'dawg'});
      adapter = robot.adapter;
      return done();
    });

    return robot.run();
  });

  afterEach(function() {
    return robot.shutdown();
  });

  describe('#enable ooo', function() {
    describe('enable ooo without custom message', () =>
      it('will enable ooo without a custom message', function(done) {
        const onReply = spy(function(envelope, strings) {
          expect(strings[0]).to.contain(['out of office enabled']);

          return done();
        });

        adapter.on('reply', onReply);
        return adapter.receive(new TextMessage(user1, 'jarvis enable ooo'));
      })
    );

    describe('enable ooo with custom message', () =>
      it('will enable ooo with a custom message', function(done) {
        const onReply = spy(function(envelope, strings) {
          expect(strings[0]).to.contain(['out of office enabled with message "gone fishin"']);

          return done();
        });

        adapter.on('reply', onReply);
        return adapter.receive(new TextMessage(user1, 'jarvis enable ooo gone fishin'));
      })
    );

    return describe('enable ooo with custom message with special characters', () =>
      it('will enable ooo with a custom message with special characters', function(done) {
        const onReply = spy(function(envelope, strings) {
          expect(strings[0]).to.contain(['out of office enabled with message "`~!@#$%^&*()_+-={}|[]\\:";\'<>?,./"']);

          return done();
        });

        adapter.on('reply', onReply);
        return adapter.receive(new TextMessage(user1, 'jarvis enable ooo `~!@#$%^&*()_+-={}|[]\\:";\'<>?,./'));
      })
    );
  });

  describe('#disable ooo', function() {
    describe('disable ooo for user with ooo enabled without a custom message', () =>
      it('will disable ooo', function(done) {
        const onReply = spy(function(envelope, strings) {
          expect(strings[0]).to.contain(['out of office disabled']);

          return done();
        });

        adapter.on('reply', onReply);
        return adapter.receive(new TextMessage(user2, 'jarvis disable ooo'));
      })
    );

    describe('disable ooo for user with ooo enabled with a custom message', () =>
      it('will disable ooo', function(done) {
        const onReply = spy(function(envelope, strings) {
          expect(strings[0]).to.contain(['out of office disabled']);

          return done();
        });

        adapter.on('reply', onReply);
        return adapter.receive(new TextMessage(user3, 'jarvis disable ooo'));
      })
    );

    return describe('disable ooo for user with ooo disabled', () =>
      it('will disable ooo', function(done) {
        const onReply = spy(function(envelope, strings) {
          expect(strings[0]).to.contain(['out of office wasn\'t enabled']);

          return done();
        });

        adapter.on('reply', onReply);
        return adapter.receive(new TextMessage(user1, 'jarvis disable ooo'));
      })
    );
  });

  describe('#trigger ooo', function() {
    describe('trigger ooo for non existent user', function() {});
      //todo - not sure how to test given that the expected outcome is there is no message reply

    describe('trigger ooo for user with ooo enabled without a custom message', () =>
      it('reply with ooo', function(done) {
        let count = 0;
        const onReply = spy(function(envelope, strings) {
          count++;

          expect(strings[0]).to.contain(['is out of office']);

          if (count === 9) {
            return done();
          }
        });

        adapter.on('reply', onReply);
        adapter.receive(new TextMessage(user2, 'Where is @mike?'));
        adapter.receive(new TextMessage(user2, 'Where is @mike ?'));
        adapter.receive(new TextMessage(user2, 'Where is @mike today?'));
        adapter.receive(new TextMessage(user2, '@mike are you there?'));
        adapter.receive(new TextMessage(user2, 'Thanks @mike'));
        adapter.receive(new TextMessage(user2, 'Thanks @mike '));
        adapter.receive(new TextMessage(user2, '@mike'));
        adapter.receive(new TextMessage(user2, ' @mike'));
        return adapter.receive(new TextMessage(user2, ' @mike '));
      })
    );

    return describe('trigger ooo for user with ooo enabled with a custom message', () =>
      it('reply with ooo', function(done) {
        let count = 0;
        const onReply = spy(function(envelope, strings) {
          count++;

          expect(strings[0]).to.contain(['is out of office \"dawg\"']);

          if (count === 9) {
            return done();
          }
        });

        adapter.on('reply', onReply);
        adapter.receive(new TextMessage(user3, 'Where is @david?'));
        adapter.receive(new TextMessage(user3, 'Where is @david ?'));
        adapter.receive(new TextMessage(user3, 'Where is @david today?'));
        adapter.receive(new TextMessage(user3, '@david are you there?'));
        adapter.receive(new TextMessage(user3, 'Thanks @david'));
        adapter.receive(new TextMessage(user3, 'Thanks @david '));
        adapter.receive(new TextMessage(user3, '@david'));
        adapter.receive(new TextMessage(user3, ' @david'));
        return adapter.receive(new TextMessage(user3, ' @david '));
      })
    );
  });

  return describe('#check ooo', function() {
    describe('check ooo for user without ooo enabled', () =>
      it('reply that the user does not have an ooo enabled', function(done) {
        const onReply = spy(function(envelope, strings) {
          expect(strings[0]).to.contain(['you do not have an out of office enabled']);

          return done();
        });

        adapter.on('reply', onReply);
        return adapter.receive(new TextMessage(user1, 'jarvis check ooo'));
      })
    );

    describe('check ooo for user with ooo enabled without a custom message', () =>
      it('reply that the user does not have an ooo enabled', function(done) {
        const onReply = spy(function(envelope, strings) {
          expect(strings[0]).to.contain(['you have an out of office enabled with no custom message']);

          return done();
        });

        adapter.on('reply', onReply);
        return adapter.receive(new TextMessage(user2, 'jarvis check ooo'));
      })
    );

    return describe('check ooo for user with ooo enabled with a custom message', () =>
      it('reply that the user does not have an ooo enabled', function(done) {
        const onReply = spy(function(envelope, strings) {
          expect(strings[0]).to.contain(['you have an out of office enabled with custom message \"dawg\"']);

          return done();
        });

        adapter.on('reply', onReply);
        return adapter.receive(new TextMessage(user3, 'jarvis check ooo'));
      })
    );
  });
});