const DelegateTransaction = require("../models/DelegateTransaction");
const { actions } = require("./delegatesActions");
const CallbackTask = require("../models/CallbackTask");
const CronJob = require("cron").CronJob;
const IssuerService = require("../services/IssuerService");

const REFILL_SECONDS = "0";
const REFILL_MINUTES = "*/2";
const REFILL_HOURS = "*";
const REFILL_DAY_OF_MONTH = "*";
const REFILL_MONTH = "*";
const REFILL_DAY_OF_WEEL = "*";

let enabled = true;

const delegateJob = frequency => {
	new CronJob(
		frequency,
		async () => {
			if (enabled) {
				enabled = false;

				const delegateTransactions = await DelegateTransaction.find({});
				const count = delegateTransactions.length;

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
			const callbackTasks = await CallbackTask.find({});
			const count = callbackTasks.length;

			for (const callbackTask of callbackTasks) {
				const { _id, callbackUrl, did, token, status, expireOn, blockHash, messageError } = callbackTask;
				try {
					await IssuerService.callback(callbackUrl, did, token, { status, expireOn, blockHash, messageError });
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
	const frequency = [
		REFILL_SECONDS,
		REFILL_MINUTES,
		REFILL_HOURS,
		REFILL_DAY_OF_MONTH,
		REFILL_MONTH,
		REFILL_DAY_OF_WEEL
	].join(" ");

	delegateJob(frequency);
	callbackTaskJob(frequency);
};
