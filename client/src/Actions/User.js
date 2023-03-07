import axios from "axios";

export const registerUser =
	(name, username, email, avatar, password) => async (dispatch) => {
		try {
			//dispatching the action to show the loading spinner
			dispatch({ type: "RegisterRequest" });

			// sending the request to the server
			const { data } = await axios.post(
				"/users/register",
				{ name, username, email, avatar, password },
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);

			if (!data) {
				dispatch({
					type: "RegisterFailure",
					payload: "No data found",
				});
			} else {
				// if the request is successful, we dispatch the action to set the user data
				dispatch({
					type: "RegisterSuccess",
					payload: data.foundUser,
				});
			}
		} catch (error) {
			// if the request is not successful, we dispatch the action to set the error message
			dispatch({
				type: "RegisterFailure",
				payload: error.response.data.message,
			});
		}
	};

export const loginUser = (email, password) => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "LoginRequest" });

		// sending the request to the server
		const { data } = await axios.post(
			"/users/login",
			{ email, password },
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!data) {
			dispatch({
				type: "LoginFailure",
				payload: "No data found",
			});
		} else {
			// if the request is successful, we dispatch the action to set the user data
			dispatch({
				type: "LoginSuccess",
				payload: data.foundUser,
			});
		}
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "LoginFailure",
			payload: error.response.data.message,
		});
	}
};

export const loadUser = () => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "LoadUserRequest" });

		// sending the request to the server
		const { data } = await axios.get("/users/me");

		//if data is null, then dispatch LoadUserFailure
		if (!data) {
			dispatch({
				type: "LoadUserFailure",
				payload: "No data found",
			});
		} else {
			// if the request is successful, we dispatch the action to set the user data
			dispatch({
				type: "LoadUserSuccess",
				payload: data.user,
			});
		}
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "LoadUserFailure",
			payload: error.response.data.message,
		});
	}
};

export const getPostsOfFollowing = () => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "postsOfFollowingRequest" });

		// sending the request to the server
		const { data } = await axios.get("/posts");

		if (!data) {
			dispatch({
				type: "postsOfFollowingFailure",
				payload: "No data found",
			});
		} else {
			// if the request is successful, we dispatch the action to set the user data
			dispatch({
				type: "postsOfFollowingSuccess",
				payload: data.posts,
			});
		}
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "postsOfFollowingFailure",
			payload: error.response.data.message,
		});
	}
};

export const getAllUsers =
	(name = "") =>
	async (dispatch) => {
		try {
			//dispatching the action to show the loading spinner
			dispatch({ type: "allUsersRequest" });

			// sending the request to the server
			const { data } = await axios.get(`/users?name=${name}`);

			if (!data) {
				dispatch({
					type: "allUsersFailure",
					payload: "No data found",
				});
			} else {
				// if the request is successful, we dispatch the action to set the user data
				dispatch({
					type: "allUsersSuccess",
					payload: data.users,
				});
			}
		} catch (error) {
			// if the request is not successful, we dispatch the action to set the error message
			dispatch({
				type: "allUsersFailure",
				payload: error.response.data.message,
			});
		}
	};

export const getMyPosts = () => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "myPostRequest" });

		// sending the request to the server
		const { data } = await axios.get("/users/me/posts");

		if (!data) {
			dispatch({
				type: "myPostFailure",
				payload: "No data found",
			});
		} else {
			// if the request is successful, we dispatch the action to set the user data
			dispatch({
				type: "myPostSuccess",
				payload: data.posts,
			});
		}
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "myPostFailure",
			payload: error.response.data.message,
		});
	}
};

export const logOutUser = () => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "LogoutRequest" });

		// sending the request to the server
		await axios.get("/users/logout");

		// if the request is successful, we dispatch the action to set the user data
		dispatch({ type: "LogoutSuccess" });
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "LogoutFailure",
			payload: error.response.data.message,
		});
	}
};

export const updateProfile = (name, email, avatar) => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "updateProfileRequest" });

		// sending the request to the server
		const { data } = await axios.patch("/users/update/profile", {
			name,
			email,
			avatar,
		});

		if (!data) {
			dispatch({
				type: "updateProfileFailure",
				payload: "No data found",
			});
		} else {
			// if the request is successful, we dispatch the action to set the user data
			dispatch({
				type: "updateProfileSuccess",
				payload: data.message,
			});
		}
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "updateProfileFailure",
			payload: error.response.data.message,
		});
	}
};

export const updatePassword =
	(oldPassword, newPassword) => async (dispatch) => {
		try {
			//dispatching the action to show the loading spinner
			dispatch({ type: "updatePasswordRequest" });

			// sending the request to the server
			const { data } = await axios.patch("/users/update/password", {
				oldPassword,
				newPassword,
			});

			if (!data) {
				dispatch({
					type: "updatePasswordFailure",
					payload: "No data found",
				});
			} else {
				// if the request is successful, we dispatch the action to set the user data
				dispatch({
					type: "updatePasswordSuccess",
					payload: data.message,
				});
			}
		} catch (error) {
			// if the request is not successful, we dispatch the action to set the error message
			dispatch({
				type: "updatePasswordFailure",
				payload: error.response.data.message,
			});
		}
	};

export const deleteAccount = () => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "deleteAccountRequest" });

		// sending the request to the server
		const { data } = await axios.delete("/users/delete/me");

		if (!data) {
			dispatch({
				type: "deleteAccountFailure",
				payload: "No data found",
			});
		} else {
			// if the request is successful, we dispatch the action to set the user data
			dispatch({
				type: "deleteAccountSuccess",
				payload: data.message,
			});
		}
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "deleteAccountFailure",
			payload: error.response.data.message,
		});
	}
};

export const forgotPassword = (email) => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "forgotPasswordRequest" });

		// sending the request to the server
		const { data } = await axios.post(
			"/users/forgot-password",
			{
				email,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!data) {
			dispatch({
				type: "forgotPasswordFailure",
				payload: "No data found",
			});
		} else {
			// if the request is successful, we dispatch the action to set the user data
			dispatch({
				type: "forgotPasswordSuccess",
				payload: data.message,
			});
		}
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "forgotPasswordFailure",
			payload: error.response.data.message,
		});
	}
};

export const resetPassword = (token, password) => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "resetPasswordRequest" });

		// sending the request to the server
		const { data } = await axios.patch(
			`/users/reset-password/${token}`,
			{
				password,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!data) {
			dispatch({
				type: "resetPasswordFailure",
				payload: "No data found",
			});
		} else {
			// if the request is successful, we dispatch the action to set the user data
			dispatch({
				type: "resetPasswordSuccess",
				payload: data.message,
			});
		}
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "resetPasswordFailure",
			payload: error.response.data.message,
		});
	}
};

export const getUserPosts = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "userPostRequest",
		});

		const { data } = await axios.get(`/users/${id}/posts`);

		if (!data) {
			dispatch({
				type: "userPostFailure",
				payload: "No data found",
			});
		} else {
			dispatch({
				type: "userPostSuccess",
				payload: data.posts,
			});
		}
	} catch (error) {
		dispatch({
			type: "userPostFailure",
			payload: error.response.data.message,
		});
	}
};

export const getUserProfile = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "userProfileRequest",
		});

		const { data } = await axios.get(`/users/profile/${id}`);

		if (!data) {
			dispatch({
				type: "userProfileFailure",
				payload: "No data found",
			});
		} else {
			dispatch({
				type: "userProfileSuccess",
				payload: data.user,
			});
		}
	} catch (error) {
		dispatch({
			type: "userProfileFailure",
			payload: error.response.data.message,
		});
	}
};

export const followAndUnfollowUser = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "followUserRequest",
		});

		const { data } = await axios.get(`/users/follow/${id}`);

		if (!data) {
			dispatch({
				type: "followUserFailure",
				payload: "No data found",
			});
		} else {
			dispatch({
				type: "followUserSuccess",
				payload: data.message,
			});
		}
	} catch (error) {
		dispatch({
			type: "followUserFailure",
			payload: error.response.data.message,
		});
	}
};
