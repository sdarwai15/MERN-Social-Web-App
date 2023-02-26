import axios from "axios";

export const likePost = (id) => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "likeRequest" });

		// sending the request to the server
		const { data } = await axios.get(`/posts/${id}`);

		// if the request is successful, we dispatch the action to set the user data
		dispatch({
			type: "likeSuccess",
			payload: data.message,
		});
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "likeFailure",
			payload: error.response.data.message,
		});
	}
};

export const addCommentOnPost = (id, comment) => async (dispatch) => {
	try {
		//dispatching the action to show the loading spinner
		dispatch({ type: "addUpdateCommentRequest" });

		// sending the request to the server
		const { data } = await axios.patch(
			`/posts/${id}/comment`,
			{
				comment,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		// if the request is successful, we dispatch the action to set the user data
		dispatch({
			type: "addUpdateCommentSuccess",
			payload: data.message,
		});
	} catch (error) {
		// if the request is not successful, we dispatch the action to set the error message
		dispatch({
			type: "addUpdateCommentFailure",
			payload: error.response.data.message,
		});
	}
};

export const deleteCommentOnPost = (id, commentId) => async (dispatch) => {
	try {
		dispatch({
			type: "deleteCommentRequest",
		});

		const { data } = await axios.delete(`/posts/${id}/comment`, {
			data: { commentId },
		});
		dispatch({
			type: "deleteCommentSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "deleteCommentFailure",
			payload: error.response.data.message,
		});
	}
};

export const newPost = (caption, image) => async (dispatch) => {
	try {
		dispatch({ type: "newPostRequest" });

		const { data } = await axios.post(
			"/posts/createpost",
			{
				caption,
				image,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		dispatch({
			type: "newPostSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "newPostFailure",
			payload: error.response.data.message,
		});
	}
};

export const updatePost = (caption, id) => async (dispatch) => {
	try {
		dispatch({ type: "updateCaptionRequest" });

		const { data } = await axios.patch(
			`/posts/${id}`,
			{
				caption,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		dispatch({
			type: "updateCaptionSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "updateCaptionFailure",
			payload: error.response.data.message,
		});
	}
};

export const deletePost = (id) => async (dispatch) => {
	try {
		dispatch({ type: "deletePostRequest" });

		const { data } = await axios.delete(`/posts/${id}`);

		dispatch({
			type: "deletePostSuccess",
			payload: data.message,
		});
	} catch (error) {
		dispatch({
			type: "deletePostFailure",
			payload: error.response.data.message,
		});
	}
};
