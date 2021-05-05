/* eslint-disable no-new */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const { CronJob } = require('cron');
const DelegateTransaction = require('../models/DelegateTransaction');
const { actions: actionsDelegate } = require('./delegatesActions');
const { actions: actionsCallback } = require('./callbackActions');
const CallbackTask = require('../models/CallbackTask');
const { JOBS } = require('../constants/Constants');

const SECONDS = '0';
const MINUTES = '*/2';
const HOURS = '*';
const DAY_OF_MONTH = '*';
const MONTH = '*';
const DAY_OF_WEEK = '*';

let enabled = true;

const processDelegateTx = async () => {
  if (enabled) {
    enabled = false;

    const delegateTransactions = await DelegateTransaction.find({});
    // eslint-disable-next-line no-console
    console.log({ delegateTransactions });

    // TODO: Fix await inside loop
    for (const transaction of delegateTransactions) {
      const { _id, action } = transaction;
      try {
        await actionsDelegate[action](transaction.toObject());
        await DelegateTransaction.deleteOne({ _id });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
    enabled = true;
  }
};

const delegateJob = (frequency) => {
  new CronJob(
    frequency,
    processDelegateTx,
    null,
    true,
    'America/Argentina/Buenos_Aires',
    null,
    true,
  );
};

const processCallbackTask = async () => {
  // Se ejecutan de a 5
  const callbackTasks = await CallbackTask.find({
    status: {
      $ne: JOBS.CANCEL_CALLBACK,
    },
  })
    .sort({ createdOn: -1 })
    .limit(5);
  // eslint-disable-next-line no-console
  console.log({ callbackTasks });

  // TODO: Fix await inside loop
  for (const callbackTask of callbackTasks) {
    try {
      const plainCallbackTask = callbackTask.toObject();
      await actionsCallback[callbackTask.actionTag](plainCallbackTask);
      // eslint-disable-next-line no-underscore-dangle
      await CallbackTask.deleteOne({ _id: plainCallbackTask._id });
    } catch (error) {
      await callbackTask.addAttempt();
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

const callbackTaskJob = (frequency) => {
  new CronJob(
    frequency,
    processCallbackTask,
    null,
    true,
    'America/Argentina/Buenos_Aires',
    null,
    true,
  );
};

exports.permanentJob = () => {
  const frequency = [
    SECONDS,
    MINUTES,
    HOURS,
    DAY_OF_MONTH,
    MONTH,
    DAY_OF_WEEK,
  ].join(' ');

  delegateJob(frequency);
  callbackTaskJob(frequency);
};
