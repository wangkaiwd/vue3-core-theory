const queue = [];
let pending = false;
const resolvedPromise = Promise.resolve();
let currentFlushPromise;
const flushJobs = () => {
  queue.forEach(q => q());
  pending = false;
};
const queueFlush = () => {
  if (!pending) {
    pending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
};
export const queueJob = (job) => {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  queueFlush();
};
export const nextTick = (fn) => {
  const p = currentFlushPromise || resolvedPromise;
  return p.then(fn);
};
