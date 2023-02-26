import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadUser } from "./Actions/User";
import "./App.css";
import Account from "./Components/Account/Account";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import Header from "./Components/Header/Header";
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import NewPost from "./Components/NewPost/NewPost";
import NotFound from "./Components/NotFound/NotFound";
import Register from "./Components/Register/Register";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import Search from "./Components/Search/Search";
import UpdatePassword from "./Components/UpdatePassword/UpdatePassword";
import UpdateProfile from "./Components/UpdateProfile/UpdateProfile";
import UserProfile from "./Components/UserProfile/UserProfile";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadUser());
	}, []);

	// checking if user is logged in
	const { isAuthenticated } = useSelector((state) => state.user);

	return (
		<Router>
			{isAuthenticated && <Header />}

			<Routes>
				{/* register or account */}
				<Route
					path="/register"
					element={isAuthenticated ? <Account /> : <Register />}
				/>

				{/* homepage or login */}
				<Route path="/" element={isAuthenticated ? <Home /> : <Login />} />

				{/* account or login */}
				<Route
					path="/account"
					element={isAuthenticated ? <Account /> : <Login />}
				/>

				{/* new post or login */}
				<Route
					path="/newpost"
					element={isAuthenticated ? <NewPost /> : <Login />}
				/>

				{/* update profile or login */}
				<Route
					path="/users/update/profile"
					element={isAuthenticated ? <UpdateProfile /> : <Login />}
				/>

				{/* update password or login */}
				<Route
					path="/users/update/password"
					element={isAuthenticated ? <UpdatePassword /> : <Login />}
				/>

				{/* update or forgot password */}
				<Route
					path="/users/forgot-password"
					element={isAuthenticated ? <UpdatePassword /> : <ForgotPassword />}
				/>

				{/* reset password */}
				<Route
					path="/users/reset-password/:token"
					element={isAuthenticated ? <UpdatePassword /> : <ResetPassword />}
				/>

				{/* user profile or login */}
				<Route
					path="/users/:id"
					element={isAuthenticated ? <UserProfile /> : <Login />}
				/>

				{/* search user or login */}
				<Route
					path="/users/search"
					element={isAuthenticated ? <Search /> : <Login />}
				/>

				{/* NOT FOUND */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default App;
