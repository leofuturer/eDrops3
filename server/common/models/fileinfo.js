'use strict';
const redirectAfterEdittingStatus = require('../../server/hooks/redirectAfterEdittingStatus');

module.exports = function(Fileinfo) {
    /*
    * Redirect the page after receiving response from server
    * otherwise the api will present in the address bar of explorer
    */
    Fileinfo.afterRemote('editStatus', redirectAfterEdittingStatus);

    /* 
    * remotemethod: returnFileInfo
    * Description: Logged-in customers use this api to retrieve all their files uploaded
    * Note: no need to write this remote method because a method is exposed automatically 
    *       for the model relation if we define a model relation as fileInfo belongsTo customer
    */
    /*
    Fileinfo.returnFileInfo = (ctx, next) => {
        let { userId } = ctx.req.accessToken;
        Fileinfo.find({where: {uploaderId: userId}}, (err, instances) => {
            if (err)
                console.log(err);
            else{
                return next(null, instances);
            }
        });
    };
    
    Fileinfo.remoteMethod('returnFileInfo', {
        description: "Retrieve all information of logged-in customer's files.",
        accepts: {arg: 'ctx', type: 'object', http: {source: 'context' } },
        returns: {arg: 'fileInfoInstances', type: 'array', root: true},
        http: {path: '/returnfileInfo', verb: 'get'},
    });
    */

    /*
    * remotemethod: workerFileInfo
    * Description: Logged-in workers use this api to retrieve all files assigned to them
    * 
    * 
    */
    /*
    Fileinfo.workerFileInfo = (ctx, next) => {
        let { userId } = ctx.req.accessToken;
        Fileinfo.find({where: {avtoworkerId: userId}}, (err, fileInstances) => {
            if(err) {
                console.log(err);
            } else {
                return next(null, fileInstances);
            }
        });
    }

    Fileinfo.remoteMethod('workerFileInfo', {
        description: "Retrieve all information of files belongs to the logged-in foundry worker.",
        accepts: {arg: 'ctx', type: 'object', http: {source: 'context'}},
        returns: {arg: 'fileInstances', type: 'array', root: true},
        http: {path: '/returnworkerfileInfo', verb: 'get'},
    });
    */

    /*
    * remoteMethod: adminRetrieveUserFiles
    * Description: Admin retrieve information of certain customer's files
    * Next step: combine this remoteMethod with the api ---- "returnFileInfo"
    */
    /*
    Fileinfo.adminRetrieveUserFiles = (userId, isCustomer, next) => {
        if (isCustomer) {
            Fileinfo.find({where: {uploaderId: userId}}, (err, instances) => {
                if (err)
                console.log(err);
                else{
                    return next(null, instances);
                }
            });
        } else {
            Fileinfo.find({where: {avtoworkerId: userId}}, (err, instances) => {
                if (err)
                console.log(err);
                else{
                    return next(null, instances);
                }
            });
        }
    }

    Fileinfo.remoteMethod('adminRetrieveUserFiles', {
        description: "Admin retrieve information of certain customer's files.",
        accepts: [{arg: 'userId', type: 'number', http: {source: 'form' }},
                   {arg: 'isCustomer', type: 'boolean', http: {source: 'form'}}],
        returns: {arg: 'instances', type: 'array', root: true},
        http: {path: '/admin-retrieve-user-files', verb: 'post'},
    });
    */
   
    /*
    * remoteMethod: assignFile
    * Description: admin use this api to assign files to certain worker
    * 
    */
    Fileinfo.assignFile = (fileId, workerId, next) => {
        let app = Fileinfo.app;
        let workerModel = app.models.foundryWorker;
        Fileinfo.findById(fileId, (err, fileInstance) => {
            if(err)
            console.log(err);
            else {
            fileInstance.updateAttribute('avtoworkerId', workerId, (err, updatedFileinfo) => {
                if(err)
                console.log(err);
                else{
                    workerModel.findById(workerId, (err, workerInstance) => {
                        if (err) {
                            console.log(err);
                        } else {
                            let workerName = workerInstance.username;
                            updatedFileinfo.updateAttribute('avtoworkerName', workerName, (err, secUpdatedFileInfo) => {
                                if(err) {
                                    console.log(err);
                                } else {
                                    secUpdatedFileInfo.updateAttribute('status', 'Assigned to Foundry', (err, thirdUpdatedFileInfo) => {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            return next(null, thirdUpdatedFileInfo);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        });
    }

    Fileinfo.remoteMethod('assignFile', {
        description: "Assign file to foundry worker by fileId.",
        accepts: [{arg: 'fileId', type: 'number', http: {source: 'form'}},
                  {arg: 'workerId', type: 'number', http: {source: 'form'}}],
        returns: [{arg: 'updatedFileinfo', type: 'object'},
                  {arg: 'workerName', type: 'string'}],
        http: {path: '/assignfile', verb: 'post'}
    });

    /*
    * remoteMethod: editStatus
    * Discription: workers use this api to edit the status of the file assigned to them
    * 
    * 
    */
    Fileinfo.editStatus = (fileId, status, next) => {
        Fileinfo.findById(fileId, (err, fileInstance) => {
            if(err) {
                console.log(err);
            } else {
                fileInstance.updateAttribute('status', status, (err, updatedFileInfo) => {
                    return next(null, updatedFileInfo);
                })
            }
        });
    }

    Fileinfo.remoteMethod('editStatus', {
        description: "worker edit status of files assigned to them.",
        accepts: [{arg: "fileId", type: "number", http: {source: "form"}},
                  {arg: "status", type: "string", http: {source: "form"}}],
        returns: {arg: "updateFileInfo", type: "object", root: true},
        http: {path: "/worker-edit-status", verb: "post"}
    });
};
