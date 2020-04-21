import React from 'react';
import Worker from './worker.jsx';

export class WorkerList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            this.props.workerArray.map(singleWorker => <Worker worker={singleWorker}/>)
        );
    }
}
