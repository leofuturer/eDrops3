'use strict';
const createFileinfo = require("../../server/hooks/createFileinfo");

module.exports = function(Container) {
    //[For test]Create the fileinfo after a certain customer upload a file
    Container.afterRemote('upload', createFileinfo);
};
