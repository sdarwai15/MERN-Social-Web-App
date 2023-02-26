import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getPostsOfFollowing } from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import "./Home.css";

const Home = () => {
	const dispatch = useDispatch();

	const { loading, posts } = useSelector((state) => state.postOfFollowing);

	const { users, loading: userLoading } = useSelector(
		(state) => state.allUsers
	);

	const { user: me } = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(getPostsOfFollowing());
		dispatch(getAllUsers());
	}, []);

	return (
		<>
			<div className="home">
				{loading || userLoading ? (
					<Loader />
				) : (
					<div className="homeleft">
						{posts && posts.length > 0 ? (
							posts.map((post) => {
								return (
									<Post
										key={post?._id}
										userId={post?.author?._id}
										name={post?.author?.username}
										avatar={post?.author?.avatar?.url}
										postId={post?._id}
										caption={post?.caption}
										postImage={post?.image?.url}
										likes={post?.likes || []}
										comments={post?.comments || []}
									/>
								);
							})
						) : (
							<Typography variant="h5">No posts to show</Typography>
						)}
					</div>
				)}
				<div className="homeright">
					<User userId={me._id} name={me.username} avatar={me.avatar?.url} />
					<div
						style={{
							width: "100%",
							height: "1px",
							backgroundColor: "rgb(197, 197, 197)",
						}}
					></div>

					{users && users.length > 0 ? (
						<h6
							style={{
								fontSize: "1vmax",
								fontWeight: "400",
								margin: "1.5vmin 0 0 1.5vmax",
							}}
						>
							People you may know
						</h6>
					) : (
						""
					)}
					{users && users.length > 0 ? (
						users.map((user) => {
							if (user?._id !== me?._id) {
								return (
									<User
										key={user?._id}
										userId={user?._id}
										name={user?.username}
										avatar={user?.avatar?.url}
									/>
								);
							}
						})
					) : (
						<Typography variant="h5">No users to show</Typography>
					)}
				</div>
			</div>
		</>
	);
};

export default Home;
