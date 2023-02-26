import React, { useEffect, useState } from "react";
import { Alert, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "../../Actions/User";
import "./ResetPassword.css";

const ResetPassword = () => {
	const [newPassword, setNewPassword] = useState("");
	const [showError, setShowError] = useState(false);

	const dispatch = useDispatch();
	const params = useParams();
	const { error, loading, message } = useSelector((state) => state.like);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(resetPassword(params.token, newPassword));
	};

	useEffect(() => {
		if (error) {
			setShowError(true);
			dispatch({ type: "clearErrors" });
		}
		if (message) {
			dispatch({ type: "clearMessage" });
		}
	}, [error, dispatch, message]);

	useEffect(() => {
		setTimeout(function () {
			setShowError(false);
		}, 7000);
	}, [showError]);

	return (
		<div className="resetPassword">
			<form className="resetPasswordForm" onSubmit={submitHandler}>
				<img src="../../../logo.png" alt="logo" className="logo_container" />

				<input
					type="password"
					placeholder="New Password"
					required
					className="updatePasswordInputs"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>

				<Link to="/" style={{ marginTop: "10px" }}>
					<Typography>Login</Typography>
				</Link>

				<Typography style={{ marginTop: "-15px" }}>Or</Typography>

				<Link to="/forgot/password" style={{ marginTop: "10px" }}>
					<Typography>Request Another Token!</Typography>
				</Link>

				<Button disabled={loading} type="submit" style={{ marginTop: "0px" }}>
					Reset Password
				</Button>
			</form>

			{showError && (
				<div className="errorBlock">
					<Alert severity="error">
						<strong>Error - {error}</strong>
					</Alert>
				</div>
			)}
		</div>
	);
};

export default ResetPassword;
