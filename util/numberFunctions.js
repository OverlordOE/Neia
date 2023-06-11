const emoji = require("../data/emojiCharacters");

module.exports = {
  applyEasterEggs(number, message) {
    const string = `${number}`;
    const length = string.length;

    if (string.includes("69", length - 2)) message.react("🍆");
    if (string.includes("420", length - 3)) message.react("🚬");
   
    if (string.includes("0000", string.length - 4)) {
      message.react(emoji[string[length - 5]]);
      message.react(emoji[0]);
      message.react("🇰");
    } 
    else if (string.includes("000", string.length - 3)) {
      message.react(emoji[string[length - 4]]);
      message.react("🇰");
    } 
    else if (string.includes("00", length - 2)) {
      message.react(emoji[string[length - 3]]);
      message.react("💯");
    }

    switch (number) {
      case 7:
        message.react("🍀");
        break;
      case 13:
        message.react("✡️");
        break;
      case 42:
        message.react(emoji[0]);
        break;
      case 111:
        message.react(emoji[1]);
        break;
      case 112:
        message.react("🚑");
        break;
      case 123:
        message.react(emoji[4]);
        break;
      case 222:
        message.react(emoji[2]);
        break;
      case 333:
        message.react(emoji[3]);
        break;
      case 314:
        message.react("🥧");
        break;
      case 404:
        message.react("❔");
        break;
      case 444:
        message.react(emoji[4]);
        break;
      case 555:
        message.react(emoji[5]);
        break;
      case 666:
        message.react("✡️");
        break;
      case 777:
        message.react("🍀");
        break;
      case 888:
        message.react(emoji[8]);
        break;
      case 999:
        message.react(emoji[9]);
        break;
    }
  },

  checkCheckpoint(number) {
    const checkpoints = [
      50, 100, 225, 350, 500, 650, 800, 1000, 1200, 1400, 1650, 1850, 2000,
      2250, 2500, 2750, 3000, 3300, 3600, 3900, 4200, 4600, 5000, 5500, 6000,
      6600, 7200, 7900, 8600, 9400, 10000,
    ];

    if (!checkpoints.includes(number)) return false;
    const nextCheckpointIndex = checkpoints.indexOf(number) + 1;

    return checkpoints[nextCheckpointIndex];
  },
};
