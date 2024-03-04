import ReactModal from 'react-modal';

export function DeleteModal({postId, deleteModalVisible, setDeleteModalVisible, handleDelete}:
    {postId: number | undefined, deleteModalVisible: boolean, setDeleteModalVisible: Function, handleDelete: Function}) {
    return (
        <ReactModal
            isOpen={deleteModalVisible}
            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.75)'
                },
                content: {
                    position: 'absolute',
                    top: '20%',
                    left: '35%',
                    height: '20%',
                    width: '30%',
                    background: '#fff',
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    borderRadius: '20px',
                    outline: 'none',
                    padding: '20px'
                }
                }}
        >
            <div className="flex flex-col text-left justify-center">
                <div>Are you sure you want to delete this post?</div>
                <div>
                    <button
                        // call the /delete endpoint
                        onClick={()=>{
                            if (!postId) return;
                            handleDelete(postId);
                        }}
                        className="bg-red-400 text-white p-2.5 ml-0 mt-6 mr-auto rounded"
                    >Delete</button>
                    <button 
                        onClick={()=>setDeleteModalVisible(false)}
                        className="bg-green-400 text-white p-2.5 mt-6 m-2 rounded"
                    >Cancel</button>
                </div>
            </div>
        </ReactModal>
    )
}