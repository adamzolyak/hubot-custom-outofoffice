#
# Commands:
#   hubot ooo me - test ooo

module.exports = (robot) ->

  robot.respond /ooo/i, (msg) ->
    msg.send "I heard OOO!"