const emoji = require("../data/emojiCharacters");

module.exports = {


  getEasterEggs(number) {
    const string = `${number}`;
    const length = string.length;
    const returnArray = [];

    if (string.includes("69", length - 2)) returnArray.push("🍆");
    if (string.includes("420", length - 3)) returnArray.push("🚬");

    if (string.includes("0000", string.length - 4)) {
      returnArray.push(emoji[string[length - 5]]);
      returnArray.push(emoji[0]);
      returnArray.push("🇰");
    }
    else if (string.includes("000", string.length - 3)) {
      returnArray.push(emoji[string[length - 4]]);
      returnArray.push("🇰");
    }
    else if (string.includes("00", length - 2)) {
      returnArray.push(emoji[string[length - 3]]);
      returnArray.push("💯");
    }

    switch (number) {
      case 3:
        returnArray.push("🇪");
        break;
      case 7:
        returnArray.push("🍀");
        returnArray.push("🕵️‍♂️");
        break;
      case 8: 
        returnArray.push("👾");
        break;
      case 13:
        returnArray.push("✡️");
        break;
      case 19:
        returnArray.push("�");
        break;
      case 21:
        returnArray.push("🤔");
        break;
      case 25:
        returnArray.push("🧽");
        returnArray.push("⭐");
        returnArray.push("🐙");
        break;
      case 42:
        returnArray.push(emoji[0]);
        break;
      case 71:
        returnArray.push("⚽");
        break;
      case 111:
        returnArray.push(emoji[1]);
        break;
      case 112:
        returnArray.push("🚑");
        break;
      case 123:
        returnArray.push(emoji[4]);
        break;
      case 222:
        returnArray.push(emoji[2]);
        break;
      case 333:
        returnArray.push(emoji[3]);
        break;
      case 314:
        returnArray.push("🥧");
        break;
      case 404:
        returnArray.push("❔");
        break;
      case 444:
        returnArray.push(emoji[4]);
        break;
      case 538:
        returnArray.push('�');
        break;
      case 555:
        returnArray.push(emoji[5]);
        break;
      case 666:
        returnArray.push("✡️");
        break;
      case 777:
        returnArray.push("🍀");
        break;
      case 888:
        returnArray.push(emoji[8]);
        break;
      case 999:
        returnArray.push(emoji[9]);
        break;
      case 1989:
        returnArray.push("🇨🇳")
      case 2020:
        returnArray.push("�")
    }

    return returnArray;
  },


  applyEasterEggs(easterEggs, message) {
    for (let i = 0; i < easterEggs.length; i++) {
      message.react(easterEggs[i]);
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
