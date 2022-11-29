import React from 'react';

function Progress({ now } : { now: number }) {
  const progressClass = now < 101 ? 'progress-bar' : 'progress-bar progress-bar-success';
  return (
    <div className="progress progress-striped active">
      <div role="progressbar progress-striped" style={{ width: now < 100 ? `${now}%` : '100%' }} className={progressClass} />
    </div>
  );
};
export default Progress;
