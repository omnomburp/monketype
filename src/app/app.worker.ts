/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  if (data == 'START_TIMER') {
    startTimer();
  }
});

function startTimer() {
  let timer = 30;
  setInterval(() => {
    --timer;
    postMessage({type: 'UPDATE_TIMER', timer: timer});
    if (timer === 0) {
      postMessage({type: 'TIME_ENDED'});
      clearInterval(timer);
    }
  }, 1000);
}
