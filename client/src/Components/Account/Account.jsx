import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";
import { getMyPosts, logOutUser, deleteAccount } from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import "./Account.css";

const Account = () => {
	const dispatch = useDispatch();

	const { user, loading: userLoading } = useSelector((state) => state.user);
	const { loading, posts } = useSelector((state) => state.myPosts);

	const [followersToggle, setFollowersToggle] = useState(false);
	const [followingToggle, setFollowingToggle] = useState(false);

	const logoutHandler = () => {
		dispatch(logOutUser());
	};

	const deleteProfileHandler = async () => {
		await dispatch(deleteAccount());
		dispatch(logOutUser());
	};

	useEffect(() => {
		dispatch(getMyPosts());
	}, [dispatch]);

	return loading === true || userLoading === true ? (
		<Loader />
	) : (
		<div className="account">
			<div className="accountLeft">
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
								isAccount={true}
								isDelete={true}
							/>
						);
					})
				) : (
					<Link
						to={"/newpost"}
						style={{
							textDecoration: "none",
							color: "rgb(97, 97, 226)",
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
						}}
					>
						<Button style={{ textAlign: "center" }}>
							No post yet
							<br /> wanna create some ?
						</Button>
					</Link>
				)}
			</div>
			<div className="accountright">
				<Avatar
					src={user?.avatar?.url}
					alt="avatar"
					style={{
						height: "8vmax",
						width: "8vmax",
						borderRadius: "50%",
						marginTop: "4vmax",
						marginBottom: "0",
					}}
				/>

				<Typography variant="h5">{user.name}</Typography>

				<Link
					to={"/users/update/profile"}
					style={{ textDecoration: "none", marginTop: "-40px" }}
				>
					<Button>Edit Profile</Button>
				</Link>

				<div
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<Button
						variant="outlined"
						onClick={() => setFollowersToggle(!followersToggle)}
					>
						<Typography>{user?.followers?.length} Followers</Typography>
					</Button>

					<Button
						variant="outlined"
						onClick={() => setFollowingToggle(!followingToggle)}
					>
						<Typography>{user?.followings?.length} Followings</Typography>
					</Button>
				</div>

				<div className="logoutButton">
					<Tooltip title="Logout">
						<Button color="error" onClick={logoutHandler}>
							<LogoutIcon />
						</Button>
					</Tooltip>
				</div>

				<Link
					to={"/users/update/password"}
					style={{ textDecoration: "none", marginTop: "10%" }}
				>
					<Button variant="text">Change Password</Button>
				</Link>

				<Button
					color="error"
					onClick={deleteProfileHandler}
					style={{ marginTop: "-15px" }}
				>
					Delete My Profile
				</Button>

				{/* dialog boxes */}
				<Dialog
					open={followersToggle}
					onClose={() => setFollowersToggle(!followersToggle)}
				>
					<div className="DialogBox">
						<Typography variant="h4">Followers</Typography>

						{user && user?.followers?.length > 0 ? (
							user?.followers?.map((follower) => (
								<User
									key={follower._id}
									userId={follower._id}
									name={follower.name}
									avatar={follower.avatar?.url}
								/>
							))
						) : (
							<Typography style={{ margin: "0.5vmax" }}>
								You have no followers
							</Typography>
						)}
					</div>
				</Dialog>

				<Dialog
					open={followingToggle}
					onClose={() => setFollowingToggle(!followingToggle)}
				>
					<div className="DialogBox">
						<Typography variant="h4">Following</Typography>

						{user && user?.followings?.length > 0 ? (
							user?.followings?.map((follow) => (
								<User
									key={follow._id}
									userId={follow._id}
									name={follow.name}
									avatar={follow.avatar?.url}
								/>
							))
						) : (
							<Typography style={{ margin: "0.5vmax" }}>
								You're not following anyone
							</Typography>
						)}
					</div>
				</Dialog>
			</div>
		</div>
	);
};

export default Account;
