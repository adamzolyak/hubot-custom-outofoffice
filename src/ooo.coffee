# Description
#   Allows a user to set an out of office auto reply
#
# Commands:
#   hubot enable ooo - set an out of office auto reply
#   hubot enable ooo your message - set an out of office auto reply with a custom message
#   hubot check ooo - check if you have an out of office message enabled
#   hubot disable ooo - turn off out of office auto reply
#

module.exports = (robot) ->

  getUser = (username) ->
    users = robot.brain.usersForFuzzyName(username)
    if users.length is 1
      user = users[0]
      return user

  setOOO = (user, ooomessage) ->
    user.ooo = ooomessage

  removeOOO = (user) ->
    if user.ooo?
        delete user.ooo 

  getOOO = (user) ->
    if user.ooo?
      ooo = user.ooo
      return ooo

  robot.respond /enable ooo(.*)/i, (msg) ->
    username = msg.message.user.name
    ooomsg = msg.match[1].trim()
    user = getUser(username)

    if user?
      setOOO(user, ooomsg)

      if ooomsg.length > 0 
        msg.reply "out of office enabled with message \"#{ooomsg}\""
        robot.emit "analytics", "ooo.enable", "enabled with no msg"
      else 
        msg.reply "out of office enabled"
        robot.emit "analytics", "ooo.enable", "enabled with custom msg"

  robot.respond /disable ooo/i, (msg) ->
    username = msg.message.user.name
    user = getUser(username)
    ooo = getOOO(user)

    if ooo?
      removeOOO(user)

      msg.reply "out of office disabled"
      robot.emit "analytics", "ooo.disable", "disabled"
    else
      msg.reply "out of office wasn't enabled"
      robot.emit "analytics", "ooo.disable", "wasn't enabled"

  robot.respond /check ooo/i, (msg) ->
    username = msg.message.user.name
    user = getUser(username)
    ooo = getOOO(user)

    if ooo?

      if ooo.length > 0 
        msg.reply "you have an out of office enabled with custom message \"#{ooo}\""
      else 
        msg.reply "you have an out of office enabled with no custom message"
    else 
      msg.reply "you do not have an out of office enabled"

    robot.emit "analytics", "ooo.check", ""

  robot.hear /.*@{1}([A-Za-z0-9_-]+).*/i, (msg) ->
    username = msg.match[1].trim()
    user = getUser(username)

    if user?

      ooo = getOOO(user)

      if ooo?

        if ooo.length > 0 
          msg.reply "#{username} is out of office \"#{ooo}\""
        else 
          msg.reply "#{username} is out of office"

        robot.emit "analytics", "ooo.ooo", ""

