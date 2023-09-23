import { Alert, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newPost } from "../../Actions/Post";
import { loadUser } from "../../Actions/User";
import "./NewPost.css";

const NewPost = () => {
	const [image, setImage] = useState(null);
	const [caption, setCaption] = useState("");
	const [postUploaded, setPostUploaded] = useState(false);

	const { loading, error, message } = useSelector((state) => state.newPost);
	const dispatch = useDispatch();

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		const Reader = new FileReader();
		Reader.readAsDataURL(file);

		Reader.onload = () => {
			if (Reader.readyState === 2) {
				setImage(Reader.result);
			}
		};
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		await dispatch(newPost(caption, image));
		setPostUploaded(true);
		dispatch(loadUser());
		this?.props.history.push("/");
	};

	useEffect(() => {
		if (error) {
			dispatch({ type: "clearErrors" });
		}

		if (message) {
			dispatch({ type: "clearMessage" });
		}
	}, [dispatch, error, message]);

	useEffect(() => {
		setTimeout(function () {
			setPostUploaded(false);
		}, 7000);
	}, [postUploaded]);

	return (
		<div className="newPost">
			<form className="newPostForm" onSubmit={submitHandler}>
				<img src="../../../logo.png" alt="logo" className="logo_container" />

				<Typography variant="h4">New Post</Typography>

				{image && <img src={image} alt="post" />}

				<div style={{ marginTop: "3vmax", width: "90%" }}>
					<label className="input_label" htmlFor="img">
						Add Image
					</label>
					<br />
					<input
						type="file"
						id="img"
						accept="image/*"
						onChange={handleImageChange}
						style={{
							marginTop: "-3vmin",
							display: "flex",
							justifyContent: "center",
						}}
					/>
				</div>

				<div style={{ marginTop: "8px", width: "90%" }}>
					<div className="input_container">
						<label className="input_label" htmlFor="text_field">
							Write a caption
						</label>
						<input
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							required={true}
							placeholder="Caption"
							title="Input title"
							name="input-name"
							type="text"
							className="input_field"
							id="text_field"
						/>
					</div>
				</div>

				<button
					variant="contained"
					disabled={loading}
					type="submit"
					className="sign-in_btn"
					style={{ marginTop: "20px", width: "90%" }}
				>
					Post
				</button>
			</form>

			{postUploaded && (
				<div className="postUploaded">
					<Alert severity="success">
						<strong>Post has been created successfuly!</strong>
					</Alert>
				</div>
			)}
		</div>
	);
};

export default NewPost;
