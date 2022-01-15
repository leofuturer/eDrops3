import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import { uploadFile, customerFileRetrieve } from '../../api/serverConfig';
import API from '../../api/api';
import 'bootstrap-modal';
import $ from 'jquery';
import Cookies from 'js-cookie';

import './fileUpload.css';

import '../order/animate.css';
import Dropzone from 'react-dropzone';
import { ProgressBar } from 'react-bootstrap'

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      currentIndex1: 0,
      ptype: ['private', 'public'],
      utype: ['mm', 'cm', 'in'],
      public: 'private',
      unit: 'mm',
      checked: false,
      originalName: '',
      file: undefined,
      percentage: 0,
    };
    this.setCurrentIndex = this.setCurrentIndex.bind(this);
    this.setCurrentIndex1 = this.setCurrentIndex1.bind(this);
    this.handleShopping = this.handleShopping.bind(this);
    this.handleLibrary = this.handleLibrary.bind(this);
    this.handleRename = this.handleRename.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onFileAccept = this.onFileAccept.bind(this);
    this.onFileReject = this.onFileReject.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.uploadFileRequest = this.uploadFileRequest.bind(this);
  }

  setCurrentIndex(event) {
    $('#file1').fileinput('destroy');
    this.setState({
      currentIndex: parseInt(event.currentTarget.getAttribute('index'), 10),
      public: this.state.ptype[event.currentTarget.getAttribute('index')],
    });
  }

  setCurrentIndex1(event) {
    $('#file1').fileinput('destroy');
    this.setState({
      currentIndex1: parseInt(event.currentTarget.getAttribute('index'), 10),
      unit: this.state.utype[event.currentTarget.getAttribute('index')],
    });
  }

  componentDidMount() {
    this.setState({});
  }

  onFileAccept(acceptedFiles) {
    // console.log(acceptedFiles);
    this.setState({
      file: acceptedFiles[0],
    });
  }

  onFileReject(rejectedFiles) {
    rejectedFiles.map((rejFile) => {
      rejFile.errors.map((err) => {
        alert(`Upload error:\nFor file ${rejFile.file.name}: ${err.message}`);
      });
    });
  }

  onFileUpload() {
    if (this.state.file !== undefined) {
      const _this = this;
      const { file } = this.state;
      const url = customerFileRetrieve.replace('id', Cookies.get('userId'));
      API.Request(url, 'GET', {}, true)
        .then((res) => {
          // console.log(res);
          const promises = [];
          res.data.forEach((e) => {
            promises.push(
              new Promise((resolve, reject) => {
                if (e.fileName === file.name && !e.isDeleted && !_this.state.checked) {
                  // console.log(e);
                  _this.setState({ originalName: file.name });
                  reject('Duplicate file found');
                } else {
                  resolve();
                }
              }),
            );
          });
          Promise.all(promises)
            .then(() => {
              // No duplicate files found
              this.uploadFileRequest({
                isPublic: this.state.public,
                unit: this.state.unit,
              });
            })
            .catch((msg) => {
              // console.error(err);
              $('#confirmModal').modal('show');
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  uploadFileRequest(extraFields) {
    for (let i = 0; i <= 70; i += 1) {
      setTimeout(() => {
        _this.setState({
          percentage: i,
        });
      }, 10 * i);
    }
    const _this = this;
    const uploadUrl = uploadFile.replace('id', Cookies.get('userId'));
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('fields', JSON.stringify(extraFields));
    const headers = { 'Content-Type': 'multipart/form-data' };
    API.Request(uploadUrl, 'POST', formData, true, headers, true)
      .then((res) => {
        // console.log(res);
        $('#confirmModal').modal('hide');
        _this.setState({
          fileInfo: res.data.fileInfo,
        });
        for (let i = 70; i <= 100; i += 1) {
          setTimeout(() => {
            _this.setState({
              percentage: i,
            });
          }, 10 * i);
        }
        setTimeout(() => {
          _this.setState({
            percentage: 0,
          });
          $('#uploadDoneModal').modal('show');
        }, 2000);
      })
      
      .catch((err) => {
        console.error(err);
      });
  }

  handleShopping() {
    $('#uploadDoneModal').modal('hide');
    this.props.history.push('/chipfab', {
      fileInfo: this.state.fileInfo,
    });
  }

  handleLibrary() {
    this.props.history.push('/manage/files');
  }

  handleRename() {
    const ind = this.state.originalName.lastIndexOf('.');
    const oriname = this.state.originalName;
    this.setState({ checked: true });
    const date = new Date().toISOString().replace(/[^a-zA-Z0-9 ]/g, '');
    this.uploadFileRequest({
      isPublic: this.state.public,
      unit: this.state.unit,
      newName: `${oriname.slice(0, ind)}(${date})${oriname.slice(ind)}`,
    });
  }

  handleCancel() {
    $('#file1').fileinput('clear');
    $('#confirmModal').modal('hide');
  }

  render() {
    if (Cookies.get('userId') === undefined) {
      return <Redirect to="/login" />;
    }

    const ptypeList = [];
    for (let i = 0; i < this.state.ptype.length; i++) {
      ptypeList.push(
        <li
          key={i}
          className={this.state.currentIndex === i ? 'li-active' : ''}
          index={i}
          onClick={this.setCurrentIndex}
        >
          {this.state.ptype[i]}
        </li>,
      );
    }

    const utypeList = [];
    for (let i = 0; i < this.state.utype.length; i++) {
      utypeList.push(<li key={i} className={this.state.currentIndex1 === i ? 'li-active' : ''} index={i} onClick={this.setCurrentIndex1}>{this.state.utype[i]}</li>);
    }

    return (
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
                <input type="checkbox" />
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
          <Dropzone
            onDropAccepted={(acceptedFiles) => this.onFileAccept(acceptedFiles)}
            onDropRejected={(rejectedFiles) => this.onFileReject(rejectedFiles)}
            accept=".dxf, .DXF"
            maxFiles={1}
            maxSize={30 * 1000 * 1000} // file size limit in bytes (30 MB)
            multiple={false}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="file-upload-area">
                <input {...getInputProps()} />
                {this.state.percentage > 0 ? (
                  <div className="progressBar">
                    <h3>{this.state.percentage < 100 ? 'Uploading...' : 'Completed!'}</h3>
                    <div className="progress">
                      <ProgressBar striped variant="info" now={this.state.percentage}/>
                    </div>
                  </div>
                  
                )
                  : (
                    <div className="fileUpload">
                      <p className="file-upload-insns">
                        Drag and drop DXF file here, or click to select file.
                      </p>
                      { this.state.file && <p>{this.state.file.name}</p> }
                    </div>
                  )
                }
              </div>
            )}
          </Dropzone>
          <input type="button" value="Upload File" className="input-btn" onClick={this.onFileUpload} />
        </div>

        {/* The modal */}
        <div className="modal fade" id="uploadDoneModal" tabIndex="-1" role="dialog" aria-labelledby="uploadDoneModalLabel">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title" id="uploadDoneModalLabel">eDrops</div>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="successMessage">
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

        <div className="modal fade" id="confirmModal" tabIndex="-1" role="dialog" aria-labelledby="confirmModalLabel">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title" id="confirmModalLabel">eDrops</div>
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
    );
  }
}

Upload = withRouter(Upload);
export default Upload;
