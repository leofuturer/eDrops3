import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import { uploadFile, customerFileRetrieve} from "../../api/serverConfig";
import API from "../../api/api";
import 'bootstrap-fileinput';
import 'bootstrap-modal';
import $ from 'jquery';
import Cookies from "js-cookie";
import notify from 'bootstrap-notify';

import './fileUpload.css';
import './fileinput/css/fileinput.css';
import './fileinput/css/fileinput-rtl.css';

import '../order/animate.css';

class Upload extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            currentIndex: 0,
            currentIndex1: 0,
            ptype: ['private','public'],
            utype: ['mm','cm','in'],
            public: 'private',
            unit: 'mm',
            checked: false,
            originalName: ""
        }
        this.setCurrentIndex = this.setCurrentIndex.bind(this);
        this.setCurrentIndex1 = this.setCurrentIndex1.bind(this);
        this.handleShopping = this.handleShopping.bind(this);
        this.handleLibrary = this.handleLibrary.bind(this);
        this.handleRename = this.handleRename.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    setCurrentIndex(event) {
        $("#file1").fileinput('destroy');
        this.setState({
            currentIndex: parseInt(event.currentTarget.getAttribute('index'), 10),
            public: this.state.ptype[event.currentTarget.getAttribute('index')]
        });
    }

    setCurrentIndex1(event) {
        $("#file1").fileinput('destroy');
        this.setState({
            currentIndex1: parseInt(event.currentTarget.getAttribute('index'), 10),
            unit: this.state.utype[event.currentTarget.getAttribute('index')]
        });
    }

    componentDidMount() {
        this.setState({});
    }

    componentDidUpdate() {
        let _this = this;
        const access_token = Cookies.get('access_token');

        $("#file1").fileinput({
            uploadUrl: uploadFile.replace('id', Cookies.get('userId')) + '?access_token=' + access_token, // you must set a valid URL here, or you will get an error
            allowedFileExtensions : ['dxf'],
            overwriteInitial: false,
            maxFileSize: 5000,
            maxFilesNum: 1,
            name: "file",
            uploadExtraData: {
                isPublic: this.state.public,
                unit: this.state.unit,
            },
            slugCallback: function(filename) {
                return filename.replace('(', '_').replace(']', '_');
            }
        }).on("fileloaded", function(event, file){
            let url = customerFileRetrieve.replace('id', Cookies.get('userId'));
            API.Request(url, 'GET', {}, true)
            .then((res)=>{
                res.data.forEach((e) => {
                    if(e.fileName === file.name && !e.isDeleted && !_this.state.checked){
                        //alert("Duplicate in your library. Please change your file name or delete the uploaded file!!");
                        _this.setState({originalName: file.name});
                        $("#confirmModal").modal('show');
                        
                        return;
                    }
                })
            })
        })
        .on("fileuploaded", function (event, data) {
            _this.setState({
                fileInfo: data.response.fileInfo
            });
            /*
            $.notify({
            // options
                message: 'The file has been uploaded!'
            },{
                // settings
                placement: {
                    from: "bottom",
                    align: "center"
                },
                type: 'success',
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                }
            });
            */
            $('#exampleModal').modal('show');
        });
    }

    handleShopping() {
        $('#exampleModal').modal('hide');
        this.props.history.push('/chipfab', {
            fileInfo: this.state.fileInfo,
        });
    }

    handleLibrary() {
        this.props.history.push('/manage/files');
    }

    handleRename() {
        let ind = this.state.originalName.lastIndexOf('.');
        let oriname = this.state.originalName;
        this.setState({checked: true});
        let date = new Date().toISOString().replace(/[^a-zA-Z0-9 ]/g, "");
        $("#file1").fileinput('refresh', 
            {
                uploadExtraData:{
                    isPublic: this.state.public,
                    unit: this.state.unit,
                    newName: oriname.slice(0, ind)+"("+ date +")"+oriname.slice(ind)
                }
            }   
        ).fileinput('cancel');
        $("#confirmModal").modal('hide');
    }

    handleCancel() {
        $("#file1").fileinput('clear');
        $("#confirmModal").modal('hide');
    }

    render() {
        if(Cookies.get('userId') === undefined){
            return <Redirect to='/login'></Redirect>
        }

        let ptypeList = [];
        for(let i=0; i<this.state.ptype.length; i++) {
            ptypeList.push(<li key={i} className={this.state.currentIndex === i ?
                'li-active' : ''} index={i} onClick={this.setCurrentIndex}>{this.state.ptype[i]}</li>);
        }

        let utypeList = [];
        for(let i=0; i<this.state.utype.length; i++) {
            utypeList.push(<li key={i} className={this.state.currentIndex1 === i ? 'li-active':''} index={i} onClick={this.setCurrentIndex1}>{this.state.utype[i]}</li>);
        }

        return(
            <div>
                <div className="foundry-content">
                    <h1>File Upload</h1>
                    <h3>We accept DXF file as mask file</h3>
                    <div className="vu-content">
                        <div className="visibility-div">
                            <h4>Visibility</h4>
                            <ul className="list-unstyled list-inline v-ul">
                                {ptypeList}
                            </ul>
                            <p>
                                <input type="checkbox"/>
                                <span className="span-txt">Let people copy this design with a link</span>
                            </p>
                        </div>
                        <div className="nuits-div">
                            <h4>Units</h4>
                            <ul className="list-unstyled list-inline u-ul">
                                {utypeList}
                            </ul>
                        </div>
                    </div>
                    <div className="clear">
                        <div className="form-group">
                            <input type="file" name="attach-document" id="file1" className="file-loading" />
                        </div>
                    </div>
                </div>
                <div className="hr-div-login"></div>

                {/*The modal */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title" id="exampleModalLabel">Edrop</div>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            The file has been uploaded to your library successfully!
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleShopping}>Proceed to fabrication</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.handleLibrary}>Go to file library</button>
                        </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="confirmModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" >
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title" id="exampleModalLabel">Edrop</div>
                        </div>
                        <div className="modal-body">
                            Duplicate file name! Would you like to upload another file, or you still want to
                            upload this file? (It would be recommended that you change a new name to avoid 
                            confusion.)
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleRename}>Upload this file</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.handleCancel}>Change file</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
Upload = withRouter(Upload);
export default Upload;
