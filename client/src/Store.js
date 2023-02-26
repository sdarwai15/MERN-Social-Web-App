import { configureStore } from "@reduxjs/toolkit";
import {
	likeReducer,
	addUpdateCommentReducer,
	deleteCommentReducer,
	myPostsReducer,
	newPostReducer,
	deletePostReducer,
	userPostsReducer,
} from "./Reducers/Post";
import {
	allUsersReducer,
	followUserReducer,
	forgotPasswordReducer,
	postsOfFollowingReducer,
	updatePasswordReducer,
	updateProfileReducer,
	userProfileReducer,
	userReducer,
} from "./Reducers/User";

const store = configureStore({
	reducer: {
		user: userReducer,
		postOfFollowing: postsOfFollowingReducer,
		allUsers: allUsersReducer,
		like: likeReducer,
		addUpdateComment: addUpdateCommentReducer,
		deleteComment: deleteCommentReducer,
		myPosts: myPostsReducer,
		newPost: newPostReducer,
		deletePost: deletePostReducer,
		updateProfile: updateProfileReducer,
		updatePassword: updatePasswordReducer,
		forgotPassword: forgotPasswordReducer,
		userProfile: userProfileReducer,
		userPosts: userPostsReducer,
		followUnfollow: followUserReducer,
	},
});

export default store;
