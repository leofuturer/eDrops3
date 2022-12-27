import React, { useCallback } from 'react'
import ModalBackground from './ModalBackground'

function DeleteModal({ title = "Confirm Delete", content = "Are you sure you want to delete this item?", handleHide, handleDelete }: { title?: string, content?: string | React.ReactNode, handleHide: () => void, handleDelete: () => void }) {

  const hide = useCallback(() => {
    handleHide();
  }, [handleHide]);

  const onDelete = useCallback(() => {
    handleHide();
    handleDelete();
  }, [handleDelete]);

  return (
    <ModalBackground>
      <div className="flex flex-col bg-white rounded-lg shadow-box w-1/3 divide-y">
        <div className="p-4">
          <div className="">{title}</div>
        </div>
        <div className="p-4">
          {content}
        </div>
        <div className="p-4 flex justify-end space-x-4">
          <button type="button" className="rounded-md px-4 py-2" onClick={hide}>Cancel</button>
          <button type="button" className="bg-red-700 text-white rounded-md px-4 py-2 " onClick={onDelete}>Delete</button>
        </div>
      </div>
    </ModalBackground >
  )
}

export default DeleteModal