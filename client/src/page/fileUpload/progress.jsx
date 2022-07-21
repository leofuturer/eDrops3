import React from 'react';

export const Progress = (props) => {
  const { now } = props;
  const progressClass = now < 101 ? 'progress-bar' : 'progress-bar progress-bar-success';
  return (
    <div className="progress progress-striped active">
      <div role="progressbar progress-striped" style={{ width: now < 100 ? `${now}%` : '100%' }} className={progressClass} />
    </div>
  );
};
export default Progress;
