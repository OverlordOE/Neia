const numberGameEvent = require("../numberGame/numberGameEvent.js");
const cron = require("cron");
let client;
module.exports = {
	async execute(c) {
		client = c;
		botEvents.start();
		numberGameEventStart();
		setBotActivity();
	}
};


const botEvents = new cron.CronJob("0 0/2 * * *", () => {
	numberGameEventStart();
	setBotActivity();
});


// Random number game event every 2 hours 0 0 / 2 * * *
function numberGameEventStart() {
	const time = Math.floor(Math.random() * 60) * 120000;
	client.logger.info(`Next guessingGameEvent in ${Math.floor(time / 60000)} minutes`);
	setTimeout(numberGameEvent, time, client);
}


function setBotActivity() {
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