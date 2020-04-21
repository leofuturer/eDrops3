'use strict';

module.exports = (ctx, updatedFileInfo, next) => {
    let res = ctx.res;
    res.redirect('http://localhost:8086/manage/workerfiles');
}