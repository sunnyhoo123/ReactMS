import React from 'react';

export default () => {
  let timeTimeout = null;
  function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds(); // 在小于10的数字前加一个‘0’
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('txt').innerHTML = h + ':' + m + ':' + s;
    timeTimeout = setTimeout(function () {
      startTime();
    }, 500);
  }
  function checkTime(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
  function stopTime(i) {
    clearTimeout(timeTimeout);
  }
  return (
    <>
      <h1 onClick={() => startTime()}>startTime</h1>
      <h1 onClick={() => stopTime()}>stopTime</h1>
      <div id="txt"></div>
    </>
  );
};
