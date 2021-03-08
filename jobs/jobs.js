const DelegateTransaction = require("../models/DelegateTransaction");
const { actions } = require("./delegatesActions");
const { actions: actionsCallback } = require("./callbackActions");
const CallbackTask = require("../models/CallbackTask");
const CronJob = require("cron").CronJob;

const SECONDS = "0";
const MINUTES = "*/2";
const HOURS = "*";
const DAY_OF_MONTH = "*";
const MONTH = "*";
const DAY_OF_WEEL = "*";

let enabled = true;

const delegateJob = frequency => {
	new CronJob(
		frequency,
		async () => {
			if (enabled) {
				enabled = false;

				const delegateTransactions = await DelegateTransaction.find({});

				for (const transaction of delegateTransactions) {
					const { _id, action } = transaction;
					try {
						await actions[action](transaction.toObject());
						await DelegateTransaction.deleteOne({ _id });
					} catch (error) {
						console.log(error);
					}
				}
				enabled = true;
			}
		},
		null,
		true,
		"America/Argentina/Buenos_Aires",
		null,
		true
	);
};

const callbackTaskJob = frequency => {
	new CronJob(
		frequency,
		async () => {
			// Se ejecutan de a 5
			const callbackTasks = await CallbackTask.find({}).sort({ createdOn: -1 }).limit(5);
			console.log({ callbackTasks });

			for (const callbackTask of callbackTasks) {
				try {
					await actionsCallback[callbackTask.actionTag](callbackTask.toObject());
					await CallbackTask.deleteOne({ _id });
				} catch (error) {
					console.log(error);
				}
			}
		},
		null,
		true,
		"America/Argentina/Buenos_Aires",
		null,
		true
	);
};

exports.permanentJob = () => {
	const frequency = [SECONDS, MINUTES, HOURS, DAY_OF_MONTH, MONTH, DAY_OF_WEEL].join(" ");

	delegateJob(frequency);
	callbackTaskJob(frequency);
};
