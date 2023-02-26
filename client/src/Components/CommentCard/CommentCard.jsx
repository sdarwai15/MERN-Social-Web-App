import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import "./CommentCard.css";
import { deleteCommentOnPost } from "../../Actions/Post";
import { getMyPosts, getPostsOfFollowing } from "../../Actions/User";
import { red } from "@mui/material/colors";

const CommentCard = ({
	userId,
	name,
	avatar,
	comment,
	commentId,
	postId,
	isAccount,
}) => {
	const { user } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const deleteCommentHandler = () => {
		dispatch(deleteCommentOnPost(postId, commentId));

		if (isAccount) {
			dispatch(getMyPosts());
		} else {
			dispatch(getPostsOfFollowing());
		}
	};

	return (
		<div className="commentUser">
			<div className="leftSection">
				<div className="imgTypo">
					<Link to={`/users/${userId}`}>
						<Avatar className="img" src={avatar} alt={name} />
						<Typography style={{ minWidth: "6vmax" }}>{name}</Typography>
					</Link>
				</div>
				<div className="cmnt">
					<Typography>{comment}</Typography>
				</div>
			</div>
			<div className="rightSection">
				{isAccount ? (
					<Button onClick={deleteCommentHandler}>
						<Delete sx={{ color: red[600] }} />
					</Button>
				) : userId === user._id ? (
					<Button onClick={deleteCommentHandler}>
						<Delete sx={{ color: red[600] }} />
					</Button>
				) : null}
			</div>
		</div>
	);
};

export default CommentCard;
