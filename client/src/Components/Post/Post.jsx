import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Typography, Dialog, Tooltip } from "@mui/material";
import User from "../User/User";
import {
	likePost,
	addCommentOnPost,
	updatePost,
	deletePost,
} from "../../Actions/Post";
import {
	getMyPosts,
	getPostsOfFollowing,
	getUserPosts,
	loadUser,
} from "../../Actions/User";
import "./Post.css";
import {
	Favorite,
	FavoriteBorder,
	ChatBubbleOutline,
	Edit,
	DeleteOutline,
} from "@mui/icons-material";
import CommentCard from "../CommentCard/CommentCard";
import { useParams } from "react-router-dom";
import { red } from "@mui/material/colors";

const Post = ({
	userId,
	name,
	avatar,
	postId,
	caption,
	postImage,
	likes = [],
	comments = [],
	isAccount = false,
	isUserProfile = false,
}) => {
	const [isLiked, setIsLiked] = useState(false);
	const [likesUser, setlikesUser] = useState(false);
	const [commentValue, setCommentValue] = useState("");
	const [commentToggle, setCommentToggle] = useState(false);
	const [captionValue, setCaptionValue] = useState(caption);
	const [captionToggle, setCaptionToggle] = useState(false);

	const dispatch = useDispatch();
	const params = useParams();

	const { user } = useSelector((state) => state.user);

	// to handle like button
	const handleLike = async () => {
		setIsLiked(!isLiked);

		await dispatch(likePost(postId));

		if (isAccount) {
			dispatch(getMyPosts());
		} else {
			dispatch(getPostsOfFollowing());
		}

		if (isUserProfile) {
			dispatch(getUserPosts(params.id));
		}
	};

	useEffect(() => {
		likes.forEach((elem) => {
			if (elem._id === user._id) {
				setIsLiked(true);
			}
		});
	}, [likes, user._id]);

	// to handle comment button
	const addCommentHandler = async (e) => {
		e.preventDefault();
		await dispatch(addCommentOnPost(postId, commentValue));

		if (isAccount) {
			dispatch(getMyPosts());
		} else {
			dispatch(getPostsOfFollowing());
		}
	};

	const updateCaptionHandler = async (e) => {
		e.preventDefault();
		await dispatch(updatePost(captionValue, postId));
		dispatch(getMyPosts());
	};

	const deletePostHandler = async () => {
		await dispatch(deletePost(postId));
		await dispatch(getMyPosts());
		dispatch(loadUser());
	};

	return (
		<div className="post">
			<div className="postHeader">
				<User userId={userId} name={name} avatar={avatar} />
				{isAccount ? (
					<Button onClick={() => setCaptionToggle(!captionToggle)}>
						<Tooltip title="Edit Caption">
							<Edit color="info" />
						</Tooltip>
					</Button>
				) : null}
			</div>
			<div className="postBody">
				<Typography>{caption}</Typography>
				<img src={postImage} alt="img" />
			</div>
			<div className="postFooter">
				<Button onClick={handleLike}>
					{isLiked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
				</Button>

				<Button>
					<ChatBubbleOutline
						style={{ marginLeft: "-25px" }}
						onClick={() => setCommentToggle(!commentToggle)}
					/>
				</Button>

				{isAccount ? (
					<Button style={{ marginLeft: "-25px" }} onClick={deletePostHandler}>
						<DeleteOutline sx={{ color: red[600] }} />
					</Button>
				) : null}

				<Typography
					style={{
						marginLeft: "25px",
						cursor: "pointer",
					}}
					onClick={() => setlikesUser(!likesUser)}
				>
					{likes.length} likes
				</Typography>

				<Dialog open={likesUser} onClose={() => setlikesUser(!likesUser)}>
					<div className="DialogBox">
						<Typography variant="h6">Liked By</Typography>
						{likes.length > 0
							? likes.map((elem) => {
									return (
										<User
											key={elem._id}
											userId={elem._id}
											name={elem.name}
											avatar={elem.avatar.url}
										/>
									);
							  })
							: "No likes yet"}
					</div>
				</Dialog>

				<Dialog
					open={commentToggle}
					onClose={() => setCommentToggle(!commentToggle)}
				>
					<div className="DialogBox">
						<Typography variant="h4">Comments</Typography>

						<form className="commentForm" onSubmit={addCommentHandler}>
							<input
								type="text"
								value={commentValue}
								onChange={(e) => setCommentValue(e.target.value)}
								placeholder="Comment Here..."
								required
							/>

							<Button type="submit" variant="contained">
								Add
							</Button>
						</form>

						{comments.length > 0 ? (
							comments.map((item) => (
								<CommentCard
									userId={item.user._id}
									name={item.user.name}
									avatar={item.user.avatar.url}
									comment={item.comment}
									commentId={item._id}
									key={item._id}
									postId={postId}
									isAccount={isAccount}
								/>
							))
						) : (
							<Typography>No comments Yet</Typography>
						)}
					</div>
				</Dialog>
			</div>

			{/* update caption */}
			<Dialog
				open={captionToggle}
				onClose={() => setCaptionToggle(!captionToggle)}
			>
				<div className="DialogBox">
					<Typography variant="h4">Update Caption</Typography>

					<form className="commentForm" onSubmit={updateCaptionHandler}>
						<input
							type="text"
							value={captionValue}
							onChange={(e) => setCaptionValue(e.target.value)}
							placeholder="Caption Here..."
							required
						/>

						<Button type="submit" variant="contained">
							Update
						</Button>
					</form>
				</div>
			</Dialog>
		</div>
	);
};

export default Post;
