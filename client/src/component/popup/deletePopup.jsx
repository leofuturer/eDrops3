import React, { useCallback } from 'react';
import './deletePopup.css';

const DeletePopup = (props) => {
  const onDelete = useCallback(() => {
    props.onDelete();
  }, [props.onDelete]);

  return (
    <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Confirm Delete</h3>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this item?</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={onDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
