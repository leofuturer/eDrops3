
import { ChevronRightIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { XMarkIcon, ArrowUturnLeftIcon, PencilIcon, CheckIcon} from "@heroicons/react/24/solid";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@edroplets/api";
import { timeAgo } from "../../lib/time";
import { PostComment as CommentType } from "@edroplets/api";
import { useCookies } from "react-cookie";

function PostComment({ comment } : {comment: CommentType }) {
	const navigate = useNavigate();
	const [deleted, setDeleted] = useState(false);
	const [comments, setComments] = useState<CommentType[]>([]);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [liked, setLiked] = useState<boolean>(false);
	const [currentlyEditing, setCurrentlyEditing] = useState(false);
	const [commentContent, setCommentContent] = useState(comment.content);
	const [newComment, setNewComment] = useState<string>(""); // eventually debounce this

  const [cookies] = useCookies(['userId']);

  // Get all comments under this comment
  useEffect(() => {
    api.postComment.getPostComments(comment.id as number)
      .then((res) => {
        // console.log('Not top-level comments', res.data);
        setComments(res);
      })
      .catch((err: AxiosError) => {
        // console.log(err);
      });
  }, [comment.id, newComment]);

	// check if comment is liked initially
	useEffect(() => {
		if (comment.id && cookies.userId) {
			api.user.getLikedComment(cookies.userId, comment.id).then((res) => {
				setLiked(!!res);
			});
		}
	}, []);

	function handleReply() {
		if(!comment.id || !cookies.userId) return;
		const newPostComment = {
			content: newComment,
			author: "",
			datetime: new Date(),
			likes: 0,
			postId: comment.postId,
			userId: cookies.userId,
			top: false,
		};
		
		api.postComment.createPostComment(comment.id, newPostComment)
			.then((res) => {
				setNewComment("");
				// @ts-ignore
				currentPost.comments += 1;
			})
			.catch((err: AxiosError) => {
				if (err.message === "No access token found") {
					navigate("/login");
				}
			});
		setExpanded(!expanded);
	}

  function needAuth(f: Function) {
    if (!cookies.userId) {
      navigate('/login');
    } else {
      f();
    }
  }

  function handleOpen() {
    setExpanded(!expanded);
  }
  
	function handleLike() {
		if(!comment.id || !cookies.userId) return;
		api.user.likeComment(cookies.userId, comment.id).then((res) => {
			setLiked(res);
			if (res) comment.likes++;
			else comment.likes--;
		})
	}

	function handleDelete() {
		if(!comment.id || !cookies.userId) return;
		if (comment.userId!=cookies.userId) return; // backend should also secure this
		if (comment.content=="<DELETED>") return;
		api.postComment.deletePostComment(comment.id).then(() => {
			console.log("deleted comment");
			setDeleted(true);
		})
	}

	function handleSaveEdit() {
		setCurrentlyEditing(false);
		// send api request
		const editedPostComment = {
			content: commentContent,
			author: "",
			datetime: new Date(),
			likes: 0,
			postId: comment.postId,
			userId: cookies.userId,
			top: false,
		};
		api.postComment.editPostComment(comment.id, editedPostComment).then(() => {
			console.log("edited comment");
		})
	}

	return (
		<div
			className={`flex flex-col space-y-2 ${
				comment.top ? "" : "pl-2 border-l-2 border-black/25"
			}`}
		>
			<div className="flex flex-col space-y-2 pb-2 border-b-2 border-black/25">
				<h3 className="text-lg">
					<Link to={`/profile/${comment?.userId}`} data-cy="commentAuthor">
						{deleted ? "<DELETED>" : comment?.author}
					</Link>{" "}
					&#8226; {timeAgo(new Date(comment.datetime))}
				</h3>
				{currentlyEditing ? <input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} data-cy="commentEditor"></input> : <p data-cy="commentContent">{deleted ? "<DELETED>" : commentContent}</p>}
				<div className="flex flex-row space-x-4">
					<div className="flex flex-row space-x-2 cursor-pointer" onClick={() => needAuth(handleLike)} data-cy="likeComment">
						<HandThumbUpIcon className={`w-6 h-6 cursor-pointer ${liked ? "fill-black" : ""}`} />
						<p data-cy="commentLikes">{comment.likes}</p>
					</div>
					<div className="flex flex-row space-x-2">
						<ArrowUturnLeftIcon className="w-5 h-5" />
						<button
							type="button"
							onClick={() => needAuth(handleOpen)}
						>
							Reply
						</button>
					</div>
					{comment.userId==cookies.userId && comment.content!="<DELETED>" && !deleted ? 
						<div className="flex flex-row space-x-2 cursor-pointer">
							{currentlyEditing ? <CheckIcon className="w-7 h-7" />: <PencilIcon className="w-7 h-7"/>}
							<button
                data-cy="editButton"
								type="button"
								onClick={() => currentlyEditing ? handleSaveEdit(): setCurrentlyEditing(true)}
							>
								{currentlyEditing ? "Save" : "Edit"}
							</button>
						</div>
						: <></>
					}
					{comment.userId==cookies.userId && comment.content!="<DELETED>" && !deleted ? 
						<div className="flex flex-row space-x-2 cursor-pointer">
							<XMarkIcon className="w-7 h-7" />
							<button
                data-cy="deleteButton"
								type="button"
								onClick={() => handleDelete()}
							>
								Delete
							</button>
						</div>
						: <></>
					}
					
				</div>
			</div>
			{expanded && (
				<div
					className={`bg-white p-2 pl-4 flex flex-col space-y-2 ${
						expanded ? "transition-all" : ""
					} ease-in-out duration-500`}
				>
					<textarea
						title="reply"
						className="w-full rounded-md resize-none border-black/25 border-2 p-2"
						value={newComment}
						onChange={(e) => {
							setNewComment(e.target.value);
						}}
						placeholder="Reply"
					/>
					<div className="flex flex-row justify-end">
						<button
							type="button"
							title="Send"
							className="bg-sky-800 rounded-md p-2"
							onClick={handleReply}
						>
							<ChevronRightIcon className="w-4 h-4 text-white" />
						</button>
					</div>
				</div>
			)}
			<div className="">
				{comments.map((comment: CommentType) => (
					<PostComment comment={comment} key={comment.id} />
				))}
			</div>
		</div>
	);
}

export default PostComment;
