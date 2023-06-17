const numberEvent = require("../numberGame/numberevent.js");
const cron = require("cron");

module.exports = {
	async execute(client) {
		botEvents.start();
		numberEventStart(client);
		setBotActivity(client);
	}
};


const botEvents = new cron.CronJob("0 0/2 * * *", () => {
	setBotActivity();
	numberEventStart();
});


// Random number game event every 2 hours 0 0 / 2 * * *
function numberEventStart(client) {
	const time = Math.floor(Math.random() * 60) * 120000;
	client.logger.info(`Next NumberEvent in ${Math.floor(time / 60000)} minutes`);
	setTimeout(numberEvent, time, client);
}


function setBotActivity(client) {
	const activityArray = [
		"people count",
		"you.",
		"time fly by",
		"Overlord",
		"Ainz",
		"the holy kingdom getting destroyed",
		"out for you",
		"the movie Vliegosaurus",
		"Garbiel waste all his money",
		"Lilly count in 10 servers",
		"Lilly ruin the longest of streaks",
		"the bees fly by",
	];

	const activityNr = Math.floor(Math.random() * activityArray.length);
	client.user.setActivity(activityArray[activityNr], { type: "WATCHING" });
}