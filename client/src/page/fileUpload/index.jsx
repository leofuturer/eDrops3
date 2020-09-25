import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import { uploadFile } from "../../api/serverConfig";
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
            ptype: ['public','private'],
            utype: ['mm','cm','in'],
            public: 'public',
            unit: 'mm',
            fileData: {}
        }
        this.setCurrentIndex = this.setCurrentIndex.bind(this);
        this.setCurrentIndex1 = this.setCurrentIndex1.bind(this);
        this.handleShopping = this.handleShopping.bind(this);
        this.handleLibrary = this.handleLibrary.bind(this);
    }

    setCurrentIndex(event) {
        this.setState({
            currentIndex: parseInt(event.currentTarget.getAttribute('index'), 10)
        });
        this.state.public = this.state.ptype[event.currentTarget.getAttribute('index')]
    }

    setCurrentIndex1(event) {
        this.setState({
            currentIndex1: parseInt(event.currentTarget.getAttribute('index'), 10)
        })
        this.state.unit = this.state.utype[event.currentTarget.getAttribute('index')]
    }

    componentDidMount() {
        let _this = this;   
        const access_token = Cookies.get('access_token');

        $("#file1").fileinput({
            uploadUrl: uploadFile.replace('id', Cookies.get('userId')) + '?access_token=' + access_token, // you must set a valid URL here, or you will get an error
            allowedFileExtensions : ['dxf'],
            overwriteInitial: false,
            maxFileSize: 5000,
            maxFilesNum: 1,
            name: "file",
            slugCallback: function(filename) {
                return filename.replace('(', '_').replace(']', '_');
            }
        }).on("fileuploaded", function (event, data) {
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
        this.props.history.push('/shop', {
            fileInfo: this.state.fileInfo,
        });
    }

    handleLibrary() {
        this.props.history.push('/manage/files');
    }

    render() {
        if(Cookies.get('username') === undefined){
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
            </div>
        )
    }
}
Upload = withRouter(Upload);
export default Upload;
