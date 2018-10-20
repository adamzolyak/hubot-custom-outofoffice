// Description
//   Allows a user to set an out of office auto reply
//
// Commands:
//   hubot enable ooo - set an out of office auto reply
//   hubot enable ooo your message - set an out of office auto reply with a custom message
//   hubot check ooo - check if you have an out of office message enabled
//   hubot disable ooo - turn off out of office auto reply
//

module.exports = function(robot) {

  const getUser = function(username) {
    const users = robot.brain.usersForFuzzyName(username);
    if (users.length === 1) {
      const user = users[0];
      return user;
    }
  };

  const setOOO = (user, ooomessage) => user.ooo = ooomessage;

  const removeOOO = function(user) {
    if (user.ooo != null) {
        return delete user.ooo; 
      }
  };

  const getOOO = function(user) {
    if (user.ooo != null) {
      const { ooo } = user;
      return ooo;
    }
  };

  robot.respond(/enable ooo(.*)/i, function(msg) {
    const username = msg.message.user.name;
    const ooomsg = msg.match[1].trim();
    const user = getUser(username);

    if (user != null) {
      setOOO(user, ooomsg);

      if (ooomsg.length > 0) { 
        msg.reply(`out of office enabled with message \"${ooomsg}\"`);
        return robot.emit("analytics", "ooo.enable", "enabled with no msg");
      } else { 
        msg.reply("out of office enabled");
        return robot.emit("analytics", "ooo.enable", "enabled with custom msg");
      }
    }
  });

  robot.respond(/disable ooo/i, function(msg) {
    const username = msg.message.user.name;
    const user = getUser(username);
    const ooo = getOOO(user);

    if (ooo != null) {
      removeOOO(user);

      msg.reply("out of office disabled");
      return robot.emit("analytics", "ooo.disable", "disabled");
    } else {
      msg.reply("out of office wasn't enabled");
      return robot.emit("analytics", "ooo.disable", "wasn't enabled");
    }
  });

  robot.respond(/check ooo/i, function(msg) {
    const username = msg.message.user.name;
    const user = getUser(username);
    const ooo = getOOO(user);

    if (ooo != null) {

      if (ooo.length > 0) { 
        msg.reply(`you have an out of office enabled with custom message \"${ooo}\"`);
      } else { 
        msg.reply("you have an out of office enabled with no custom message");
      }
    } else { 
      msg.reply("you do not have an out of office enabled");
    }

    return robot.emit("analytics", "ooo.check", "");
  });

  return robot.hear(/.*@{1}([A-Za-z0-9_-]+).*/i, function(msg) {
    const username = msg.match[1].trim();
    const user = getUser(username);

    if (user != null) {

      const ooo = getOOO(user);

      if (ooo != null) {

        if (ooo.length > 0) { 
          msg.reply(`${username} is out of office \"${ooo}\"`);
        } else { 
          msg.reply(`${username} is out of office`);
        }

        return robot.emit("analytics", "ooo.ooo", "");
      }
    }
  });
};