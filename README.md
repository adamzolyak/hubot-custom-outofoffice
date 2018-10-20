# Hubot Custom Out of Office
An Hubot script to set a custom away or out of office message so your coworkers know that you're not available. 

## How It Works

Whenever someone @mentions you in chat, hubot will respond with your out of office message if set.

The following commands are available to manage your out of office message:

`hubot enable ooo` - set an out of office auto reply
`hubot enable ooo <your message>` - set an out of office auto reply with a custom message
`hubot check ooo` - check if you have an out of office message enabled
`hubot disable ooo` - turn off out of office auto reply

## Installation

1. Add `hubot-custom-outofoffice` to hubot's `package.json` file.
1. Add `hubot-custom-outofoffice` to hubot's `external-scripts.json` file.
1. Run `npm install`.
1. Restart hubot.

## Examples

>adam: @hubot enable ooo I'm out of the office.  I'll return on Monday 10/1.
>hubot: out of office enabled with message "I'm out of the office.  I'll return on Monday 10/1."
>judy: @adam do want to grab a coffee with me?  
>hubot: @waffletron9000 is out of office "I'm out of the office.  I'll return on Monday 10/1."

## Contributing

If you have suggestions for how Top Issue Bot could be improved, or want to report a bug, open an issue!  Or Pull Request! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

This package is published on NPM at [https://www.npmjs.com/package/hubot-custom-outofoffice](https://www.npmjs.com/package/hubot-custom-outofoffice).

### Setting Up Locally

1. [Setup a local hubot](https://hubot.github.com/docs/) for testing.
1. Add `hubot-custom-outofoffice` to hubot's `package.json` file.
1. Add `hubot-custom-outofoffice` to hubot's `external-scripts.json` file.
1. Run `npm install`.
1. Start hubot using `bin\hubot`.

### Testing Locally

1. Write and save tests.
1. Run `npm install`.
1. Run `npm test`.

### Publishing to NPM

1. Make changes.
1. Write tests.
1. Confirm tests are passing.
1. Test with hubot.
1. Update version in `package.json` or run `npm version patch`.
1. Run `npm publish`.

## License

[ISC](LICENSE) © 2018 TopIssueBot <adam@tinkurlab.com> (www.tinkurlab.com)