import React, { useEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../Actions/User";
import "./Register.css";

const Register = () => {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [avatar, setAvatar] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const dispatch = useDispatch();
	const { loading, error } = useSelector((state) => state.user);

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		const Reader = new FileReader();
		Reader.readAsDataURL(file);

		Reader.onload = () => {
			if (Reader.readyState === 2) {
				setAvatar(Reader.result);
			}
		};
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		await dispatch(registerUser(name, username, email, avatar, password));
		navigate("/");
	};

	useEffect(() => {
		if (error) {
			dispatch({ type: "clearErrors" });
		}
	}, [dispatch, error]);
	return (
		<div className="register">
			<form
				className="form_container"
				onSubmit={submitHandler}
				style={{ width: "30vmax", height: "95vmin" }}
			>
				<img
					src="../../../logo.png"
					alt="logo"
					className="logo_container"
					style={{ width: "75px", height: "70px", marginTop: "-1vmax" }}
				/>

				<Avatar
					src={avatar}
					alt="User"
					sx={{
						height: "5vmax",
						width: "5vmax",
						marginTop: "1vmax",
						display: "flex",
						justifyContent: "center",
					}}
				/>
				<Button>
					<label htmlFor="files">Choose file</label>
				</Button>
				<input
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					id="files"
					style={{ display: "none" }}
				/>

				<div className="input_container">
					<label className="input_label" htmlFor="email_field">
						Name
					</label>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						required={true}
						placeholder="Name"
						title="Input title"
						name="input-name"
						type="text"
						className="input_field"
					/>
				</div>
				<div className="input_container">
					<label className="input_label" htmlFor="email_field">
						Username
					</label>
					<input
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required={true}
						placeholder="Username"
						title="Input title"
						name="input-name"
						type="text"
						className="input_field"
					/>
				</div>
				<div className="input_container">
					<label className="input_label" htmlFor="email_field">
						Email
					</label>
					<input
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						required={true}
						placeholder="Email address"
						title="Input title"
						name="input-name"
						type="email"
						className="input_field"
					/>
				</div>
				<div className="input_container">
					<label className="input_label" htmlFor="password_field">
						Password
					</label>

					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						title="Input title"
						name="input-name"
						type="password"
						className="input_field"
					/>
				</div>

				<button
					disabled={loading}
					type="submit"
					className="sign-in_btn"
					style={{ marginTop: "1vmax" }}
				>
					Sign Up
				</button>

				<Link to="/" style={{ marginTop: "1vmax" }}>
					<span>Already Signed Up? Login Now</span>
				</Link>
			</form>
		</div>
	);
};

export default Register;
