import { createReducer } from "@reduxjs/toolkit";

const initialState = {
	isAuthenticated: false,
};

export const userReducer = createReducer(initialState, {
	// login

	LoginRequest: (state) => {
		state.loading = true;
	},
	LoginSuccess: (state, action) => {
		state.loading = false;
		state.user = action.payload;
		state.isAuthenticated = true;
	},
	LoginFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
		state.isAuthenticated = false;
	},

	// register

	RegisterRequest: (state) => {
		state.loading = true;
	},
	RegisterSuccess: (state, action) => {
		state.loading = false;
		state.user = action.payload;
		state.isAuthenticated = true;
	},
	RegisterFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
		state.isAuthenticated = false;
	},

	// load user

	LoadUserRequest: (state) => {
		state.loading = true;
	},
	LoadUserSuccess: (state, action) => {
		state.loading = false;
		state.user = action.payload;
		state.isAuthenticated = true;
	},
	LoadUserFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
		state.isAuthenticated = false;
	},

	// logout

	LogoutRequest: (state) => {
		state.loading = true;
	},
	LogoutSuccess: (state) => {
		state.loading = false;
		state.user = null;
		state.isAuthenticated = false;
	},
	LogoutFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
		state.isAuthenticated = true;
	},

	// delete profile

	deleteAccountRequest: (state) => {
		state.loading = true;
	},
	deleteAccountSuccess: (state) => {
		state.loading = false;
		state.user = null;
		state.isAuthenticated = false;
	},
	deleteAccountFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
		state.isAuthenticated = true;
	},

	// clear errors

	clearErrors: (state) => {
		state.error = null;
	},
});

export const postsOfFollowingReducer = createReducer(
	{},
	{
		postsOfFollowingRequest: (state) => {
			state.loading = true;
		},
		postsOfFollowingSuccess: (state, action) => {
			state.loading = false;
			state.posts = action.payload;
		},
		postsOfFollowingFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearErrors: (state, action) => {
			state.error = null;
		},
	}
);

export const allUsersReducer = createReducer(
	{},
	{
		allUsersRequest: (state) => {
			state.loading = true;
		},
		allUsersSuccess: (state, action) => {
			state.loading = false;
			state.users = action.payload;
		},
		allUsersFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearErrors: (state) => {
			state.error = null;
		},
	}
);

export const updateProfileReducer = createReducer(
	{},
	{
		updateProfileRequest: (state) => {
			state.loading = true;
		},
		updateProfileSuccess: (state, action) => {
			state.loading = false;
			state.message = action.payload;
		},
		updateProfileFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearErrors: (state) => {
			state.error = null;
		},
		clearMessage: (state) => {
			state.message = null;
		},
	}
);

export const updatePasswordReducer = createReducer(
	{},
	{
		updatePasswordRequest: (state) => {
			state.loading = true;
		},
		updatePasswordSuccess: (state, action) => {
			state.loading = false;
			state.message = action.payload;
		},
		updatePasswordFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearErrors: (state) => {
			state.error = null;
		},
		clearMessage: (state) => {
			state.message = null;
		},
	}
);

export const forgotPasswordReducer = createReducer(initialState, {
	forgotPasswordRequest: (state) => {
		state.loading = true;
	},
	forgotPasswordSuccess: (state, action) => {
		state.loading = false;
		state.message = action.payload;
	},
	forgotPasswordFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},

	// reset password
	resetPasswordRequest: (state) => {
		state.loading = true;
	},
	resetPasswordSuccess: (state, action) => {
		state.loading = false;
		state.message = action.payload;
	},
	resetPasswordFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},

	clearErrors: (state) => {
		state.error = null;
	},
	clearMessage: (state) => {
		state.message = null;
	},
});

export const userProfileReducer = createReducer(initialState, {
	userProfileRequest: (state) => {
		state.loading = true;
	},
	userProfileSuccess: (state, action) => {
		state.loading = false;
		state.user = action.payload;
	},
	userProfileFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	clearErrors: (state) => {
		state.error = null;
	},
});

export const followUserReducer = createReducer(initialState, {
	followUserRequest: (state) => {
		state.loading = true;
	},
	followUserSuccess: (state, action) => {
		state.loading = false;
		state.message = action.payload;
	},
	followUserFailure: (state, action) => {
		state.loading = false;
		state.error = action.payload;
	},
	clearErrors: (state) => {
		state.error = null;
	},
	clearMessage: (state) => {
		state.message = null;
	},
});