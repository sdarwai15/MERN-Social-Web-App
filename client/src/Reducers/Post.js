import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const likeReducer = createReducer(initialState, {
	likeRequest: (state) => {
		state.loading = true;
	},
	likeSuccess: (state, action) => {
		state.loading = false;
		state.message = action.payload;
	},
	likeFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	clearErrors: (state, action) => {
		state.error = null;
	},
	clearMessage: (state, action) => {
		state.message = null;
	},
});

export const addUpdateCommentReducer = createReducer(initialState, {
	addUpdateCommentRequest: (state) => {
		state.loading = true;
	},
	addUpdateCommentSuccess: (state, action) => {
		state.loading = false;
		state.message = action.payload;
	},
	addUpdateCommentFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	clearErrors: (state, action) => {
		state.error = null;
	},
	clearMessage: (state, action) => {
		state.message = null;
	},
});

export const deleteCommentReducer = createReducer(initialState, {
	deleteCommentRequest: (state) => {
		state.loading = true;
	},
	deleteCommentSuccess: (state, action) => {
		state.loading = false;
		state.message = action.payload;
	},
	deleteCommentFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	clearErrors: (state, action) => {
		state.error = null;
	},
	clearMessage: (state, action) => {
		state.message = null;
	},
});

export const myPostsReducer = createReducer(initialState, {
	myPostRequest: (state) => {
		state.loading = true;
	},
	myPostSuccess: (state, action) => {
		state.loading = false;
		state.posts = action.payload;
	},
	myPostFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	clearErrors: (state, action) => {
		state.error = null;
	},
});

export const newPostReducer = createReducer(initialState, {
	newPostRequest: (state) => {
		state.loading = true;
	},
	newPostSuccess: (state, action) => {
		state.loading = false;
		state.message = action.payload;
	},
	newPostFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	clearErrors: (state, action) => {
		state.error = null;
	},
	clearMessage: (state, action) => {
		state.message = null;
	},

	// caption updation
	updateCaptionRequest: (state) => {
		state.loading = true;
	},
	updateCaptionSuccess: (state, action) => {
		state.loading = false;
		state.message = action.payload;
	},
	updateCaptionFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
});

export const deletePostReducer = createReducer(initialState, {
	deletePostRequest: (state) => {
		state.loading = true;
	},
	deletePostSuccess: (state, action) => {
		state.loading = false;
		state.message = action.payload;
	},
	deletePostFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
});

export const userPostsReducer = createReducer(initialState, {
	userPostRequest: (state) => {
		state.loading = true;
	},
	userPostSuccess: (state, action) => {
		state.loading = false;
		state.posts = action.payload;
	},
	userPostFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	clearErrors: (state, action) => {
		state.error = null;
	},
});
