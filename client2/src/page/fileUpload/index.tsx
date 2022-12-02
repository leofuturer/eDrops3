import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { uploadFile, customerFileRetrieve } from '../../api/serverConfig';
import API from '../../api/api';
import 'bootstrap-modal';
import $ from 'jquery';
import Cookies from 'js-cookie';

import Dropzone from 'react-dropzone';
import Progress from './progress';

import SEO from '../../component/header/seo';
import { metadata } from './metadata';

function Upload() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileInfo, setFileInfo] = useState(undefined);
  const [originalName, setOriginalName] = useState('');
  const [progress, setProgress] = useState(0);

  const pTypes = ['private', 'public'];
  const uTypes = ['mm', 'cm', 'in'];
  const [pType, setPType] = useState<'private' | 'public'>('private');
  const [uType, setUType] = useState<'mm' | 'cm' | 'in'>('mm');
  const [checked, setChecked] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  function setCurrentIndex(index: number) {
    $('#file1').fileinput('destroy');
    this.setState({
      currentIndex: index,
      public: this.state.ptype[index],
    });
  }

  function setCurrentIndex1(index) {
    $('#file1').fileinput('destroy');
    this.setState({
      currentIndex1: index,
      unit: this.state.utype[index],
    });
  }

  function componentDidMount() {
    this.setState({});
  }

  function onFileAccept(acceptedFiles) {
    // console.log(acceptedFiles);
    this.setState({
      file: acceptedFiles[0],
    });
  }

  function onFileReject(rejectedFiles) {
    rejectedFiles.map((rejFile) => {
      rejFile.errors.map((err) => {
        alert(`Upload error:\nFor file ${rejFile.file.name}: ${err.message}`);
      });
    });
  }

  function onFileUpload() {
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

  function uploadFileRequest(extraFields) {
    const _this = this;
    for (let i = 0; i <= 70; i += 1) {
      setTimeout(() => {
        _this.setState({
          percentage: i,
        });
      }, i * 10);
    }
    const uploadUrl = uploadFile.replace('id', Cookies.get('userId'));
    const formData = new FormData();
    formData.append('www', this.state.file);
    formData.append('fields', JSON.stringify(extraFields));
    const headers = { 'Content-Type': 'multipart/form-data' };
    API.Request(uploadUrl, 'POST', formData, true, headers, true)
      .then((res) => {
        // console.log(res);
        $('#confirmModal').modal('hide');
        _this.setState({
          fileInfo: res.data.fileInfo,
        });
        for (let i = 70; i <= 101; i += 1) {
          if (i <= 100) {
            setTimeout(() => {
              _this.setState({
                percentage: i,
              });
            }, 10 * i);
          } else {
            setTimeout(() => {
              _this.setState({ percentage: 101 }, () => {
                setTimeout(() => {
                  _this.setState({ percentage: 0 });
                  $('#uploadDoneModal').modal('show');
                }, 1000);
              });
            }, 10 * i + 1000);
          }
        }
        // setTimeout(() => {
        //   _this.setState({
        //     percentage: 0,
        //   });
        //   $('#uploadDoneModal').modal('show');
        // }, 2000);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleShopping() {
    $('#uploadDoneModal').modal('hide');
    navigate('/chipfab', {
      state: {
        fileInfo: fileInfo,
      }
    });
  }

  function handleLibrary() {
    navigate('/manage/files');
  }

  function handleRename() {
    const ind = originalName.lastIndexOf('.');
    const oriname = originalName;
    setChecked(true);
    const date = new Date().toISOString().replace(/[^a-zA-Z0-9 ]/g, '');
    uploadFileRequest({
      isPublic: pType,
      unit: uType,
      newName: `${oriname.slice(0, ind)}(${date})${oriname.slice(ind)}`,
    });
  }

  function handleCancel() {
    $('#file1').fileinput('clear');
    $('#confirmModal').modal('hide');
  }

  if (Cookies.get('userId') === undefined) {
    return redirect('/login');
  }

  const ptypeList = pTypes.map((p, i) => {
    return (
      <div
        key={i}
        className={`${this.state.currentIndex === i && 'bg-primary_light text-white'} border py-4 px-8 cursor-pointer`}
        onClick={() => this.setCurrentIndex(i)}
      >
        {p}
      </div>
    );
  })

  const utypeList = uTypes.map((u, i) => {
    return (
      <div
        key={i}
        className={`${this.state.currentIndex1 === i && 'bg-primary_light text-white'} border py-4 px-8 cursor-pointer`}
        onClick={() => this.setCurrentIndex1(i)}
      >
        {u}
      </div>
    );
  })

  return (
    <div className="flex flex-col items-center">
      <SEO
        title="eDrops | Upload"
        description=""
        metadata={metadata}
      />
      <div className="w-2/3 text-center flex flex-col items-center space-y-4">
        <h1 className="text-5xl">File Upload</h1>
        <h3 className="text-4xl">We accept DXF file as mask file</h3>
        <div className="grid grid-cols-2 place-items-center w-full">
          <div className="flex flex-col">
            <h4 className="text-3xl">Visibility</h4>
            <div className="flex flex-row space-x-4 justify-center">
              {ptypeList}
            </div>
            <div className="flex flex-row space-x-2 items-center">
              <input type="checkbox" id="copyLink" className="" />
              <label htmlFor="copyLink" className="">Let people copy this design with a link</label>
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="text-3xl">Units</h4>
            <div className="flex flex-row space-x-4 justify-center">
              {utypeList}
            </div>
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
            <div {...getRootProps({
              className: 'border-2 border-dashed border-black cursor-pointer w-full p-10',
            })}>
              <input {...getInputProps()} />
              {this.state.percentage > 0 ? (
                <div className="progressContainer">
                  <h3>{this.state.percentage < 101 ? 'Uploading...' : 'Completed!'}</h3>
                  <div className="uploadProgressBar">
                    <Progress now={this.state.percentage} />
                  </div>
                </div>
              )
                : (
                  <div className="">
                    <p className="text-2xl">
                      Drag and drop DXF file here, or click to select file.
                    </p>
                    {this.state.file && <p>{this.state.file.name}</p>}
                  </div>
                )}
            </div>
          )}
        </Dropzone>
        <button type="button" className="bg-secondary rounded-md py-4 px-8 text-white text-2xl w-max" onClick={this.onFileUpload} >
          Upload File
        </button>
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

export default Upload;
