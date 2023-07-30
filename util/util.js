const items = require("../data/items");
const collectables = require("../data/collectables");
const achievements = require("../data/achievements");

module.exports = {
  formatNumber(number) {
    const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];
    const tier = (Math.log10(number) / 3) | 0;

    if (tier == 0) return `**${Math.floor(number)}**`;

    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);

    const scaled = number / scale;
    return `**${Math.floor(scaled * 100) / 100 + suffix}**`;
  },

  getItem(itemName) {
    const item = itemName.toLowerCase();
    if (items[item]) return items[item];
    else return false;
  },

  getAchievement(achievementName) {
    const achievement = achievementName.toLowerCase();
    if (achievements[achievement]) return achievements[achievement];
    else return false;
  },

  getCollectable(collectableName) {
    const collectable = collectableName.toLowerCase();
    if (collectables[collectable]) return collectables[collectable];
    else return false;
  },

  setEmbedRarity(embed, rarity) {
    const r = rarity.toLowerCase();

    if (r == "uncommon") embed.setColor("#1eff00");
    else if (r == "rare") embed.setColor("#0070dd");
    else if (r == "epic") embed.setColor("#a335ee");
    else if (r == "legendary") embed.setColor("#ff8000");
    else embed.setColor("#eeeeee");
  },

  mapToDescription(toMap) {
    let common = ``;
    let uncommon = ``;
    let rare = ``;
    let epic = ``;
    let legendary = ``;

    toMap.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;

    }).map(i => {

      let item;
      if (i.amount) item = this.getItem(i.name);
      else item = this.getCollectable(i.name);

      switch (item.rarity) {
        case 'common':
          common += `${item.emoji}${item.name}\n`;
          break;
        case 'uncommon':
          uncommon += `${item.emoji}${item.name}\n`;
          break;
        case 'rare':
          rare += `${item.emoji}${item.name}\n`;
          break;
        case 'epic':
          epic += `${item.emoji}${item.name}\n`;
          break;
        case 'legendary':
          legendary += `${item.emoji}${item.name}\n`;
          break;
      }				
    });

    return `**Common**\n${common}\n
    **Uncommon**\n${uncommon}\n
    **Rare**\n${rare}\n
    **Epic**\n${epic}\n
    **Legendary**\n${legendary}`;
  }
};
