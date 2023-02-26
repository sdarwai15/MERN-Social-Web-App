import React, { useEffect, useState } from "react";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
	followAndUnfollowUser,
	getUserPosts,
	getUserProfile,
} from "../../Actions/User";
import Loader from "../Loader/Loader";
import User from "../User/User";
import Post from "../Post/Post";
import "./UserProfile.css";

const UserProfile = () => {
	const dispatch = useDispatch();
	const params = useParams();

	const {
		user,
		loading: userLoading,
		error: userError,
	} = useSelector((state) => state.userProfile);

	const { user: me } = useSelector((state) => state.user);

	const { loading, error, posts } = useSelector((state) => state.userPosts);

	const {
		error: followError,
		loading: followLoading,
	} = useSelector((state) => state.followUnfollow);

	const [followersToggle, setFollowersToggle] = useState(false);
	const [followingToggle, setFollowingToggle] = useState(false);
	const [following, setFollowing] = useState(false);
	const [myProfile, setMyProfile] = useState(false);

	const followHandler = async () => {
		setFollowing(!following);
		await dispatch(followAndUnfollowUser(user._id));
		dispatch(getUserProfile(params.id));
	};

	useEffect(() => {
		dispatch(getUserPosts(params.id));
		dispatch(getUserProfile(params.id));
	}, [dispatch, params.id]);

	useEffect(() => {
		if (me._id === params.id) {
			setMyProfile(true);
		}
		if (user) {
			user.followers.forEach((item) => {
				if (item._id === me._id) {
					setFollowing(true);
				} else {
					setFollowing(false);
				}
			});
		}
	}, [user, me._id, params.id]);

	useEffect(() => {
		if (error) {
			dispatch({ type: "clearErrors" });
		}

		if (followError) {
			dispatch({ type: "clearErrors" });
		}

		if (userError) {
			dispatch({ type: "clearErrors" });
		}
	}, [error, followError, userError, dispatch]);

	return loading === true || userLoading === true ? (
		<Loader />
	) : (
		<div className="account">
			<div className="accountLeft">
				{posts && posts.length > 0 ? (
					posts.map((post) => (
						<Post
							key={post?._id}
							postId={post?._id}
							caption={post?.caption}
							postImage={post?.image?.url}
							likes={post?.likes}
							comments={post?.comments}
							avatar={post?.author?.avatar?.url}
							name={post?.author?.name}
							userId={post?.author?._id}
							isUserProfile={true}
						/>
					))
				) : (
					<Typography variant="h6">User has not made any post</Typography>
				)}
			</div>
			<div className="accountright">
				{user && (
					<>
						<Avatar
							src={user?.avatar?.url}
							sx={{ height: "8vmax", width: "8vmax" }}
						/>

						<Typography variant="h5" style={{ marginTop: "-3px" }}>
							{user?.name}
						</Typography>

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

						{myProfile ? null : (
							<Button
								variant="contained"
								style={{ background: following ? "red" : "" }}
								onClick={followHandler}
								disabled={followLoading}
							>
								{following ? "Unfollow" : "Follow"}
							</Button>
						)}
					</>
				)}
				<Dialog
					open={followersToggle}
					onClose={() => setFollowersToggle(!followersToggle)}
				>
					<div className="DialogBox">
						<Typography variant="h4">Followers</Typography>

						{user && user?.followers?.length > 0 ? (
							user?.followers?.map((follower) => (
								<User
									key={follower?._id}
									userId={follower?._id}
									name={follower?.name}
									avatar={follower?.avatar?.url}
								/>
							))
						) : (
							<Typography style={{ margin: "2vmax" }}>
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
									key={follow?._id}
									userId={follow?._id}
									name={follow?.name}
									avatar={follow?.avatar?.url}
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

export default UserProfile;
