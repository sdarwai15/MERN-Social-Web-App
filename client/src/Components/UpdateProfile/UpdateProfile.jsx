import React, { useEffect, useState } from "react";
import { Avatar, Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import "./UpdateProfile.css";
import { loadUser, updateProfile } from "../../Actions/User";
import Loader from "../Loader/Loader";

const UpdateProfile = () => {
	const { loading, error, user } = useSelector((state) => state.user);
	const {
		loading: updateLoading,
		error: updateError,
		message,
	} = useSelector((state) => state.updateProfile);

	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [avatar, setAvatar] = useState("");
	const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);

	const dispatch = useDispatch();

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		const Reader = new FileReader();
		Reader.readAsDataURL(file);

		Reader.onload = () => {
			if (Reader.readyState === 2) {
				setAvatarPrev(Reader.result);

				setAvatar(Reader.result);
			}
		};
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		await dispatch(updateProfile(name, email, avatar));
		dispatch(loadUser());
	};

	useEffect(() => {
		if (error) {
			dispatch({ type: "clearErrors" });
		}

		if (updateError) {
			dispatch({ type: "clearErrors" });
		}

		if (message) {
			dispatch({ type: "clearMessage" });
		}
	}, [dispatch, error, updateError, message]);
	return loading ? (
		<Loader />
	) : (
		<div className="updateProfile">
			<form className="updateProfileForm" onSubmit={submitHandler}>
				<Typography
					variant="h3"
					style={{ fontFamily: "Ogg", margin: "0.7vmax" }}
				>
					Social App
				</Typography>

				<Avatar
					src={avatarPrev}
					alt="User"
					sx={{ height: "10vmax", width: "10vmax" }}
				/>

				<input type="file" accept="image/*" onChange={handleImageChange} />

				<input
					type="text"
					value={name}
					placeholder="Name"
					className="updateProfileInputs"
					required
					onChange={(e) => setName(e.target.value)}
				/>

				<input
					type="email"
					placeholder="Email"
					className="updateProfileInputs"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<Button disabled={updateLoading} type="submit" style={{marginTop: "15px"}}>
					Update
				</Button>
			</form>
		</div>
	);
};

export default UpdateProfile;
