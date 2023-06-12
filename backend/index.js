const express = require('express');
const cors = require('cors');
const middleware = require('./src/middleware/index');
const userModel = require('./model/user');
const orderModel = require('./model/order')
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const SECRET_KEY = "Vooshproject";
require('dotenv').config();



const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(middleware.decodeToken);

app.post('/add-order', middleware.decodeToken, (req, res) => {
	const { title, description, phoneNumber, subtotal, userid } = req.body;
	const neworder = orderModel.create({
		userId: userid,
		phoneno: phoneNumber,
		title: title,
		description: description,
		sub_total: subtotal
	});
})

app.post('/add-user', async (req, res) => {
	const { name, phoneNumber, password } = req.body;
	try {
		const existingUser = await userModel.findOne({ phoneno: phoneNumber })
		if (existingUser) {
			res.status(200).send({ message: 'User Already Exists' });
		}
		else {
			const nextUserId = await userModel.countDocuments() + 1;
			const hashedPassword = await bcrypt.hash(password, 10);
			const result = await userModel.create({
				uno: nextUserId,
				phoneno: phoneNumber,
				name: name,
				password: hashedPassword
			});
			res.status(200).send({ message: 'User Created Successfully' });
		}

	} catch (error) {

		res.status(500).json({ message: "Something went wrong" });
	}
})
app.post('/login-user', async (req, res) => {
	const loginby = req.body.loginby;
	if (loginby === 'normal') {
		const { phoneNumber, password } = req.body;
		try {
			const existingUser = await userModel.findOne({ phoneno: phoneNumber });
			if (!existingUser) {
				return res.status(404).json({ message: "User not found" });
			}
			const matchPassword = await bcrypt.compare(password, existingUser.password);
			if (!matchPassword) {
				return res.status(400).json({ message: "Invalid Credentials" });
			}
			const token = jwt.sign({ phoneno: existingUser.phoneno, id: existingUser.uno }, SECRET_KEY);
			res.status(200).json({ userid: existingUser.uno, token: token, status: "successful" });
		} catch (error) {
			res.status(500).json({ message: "Something went wrong" });
		}
	}
	else if (loginby === 'google') {
		const { user } = req.body;
		try {
			const existingUser = await userModel.findOne({ email: user.email });
			if (existingUser) {				
				res.json({ userid: existingUser.uno, message: "already creted and loged in" });
			}
			else {
				const nextUserId = await userModel.countDocuments() + 1;
				const result = await userModel.create({
					uno: nextUserId,
					email: user.email,
					name: user.displayName
				});
				
				res.status(200).json({ userid: result.uno, message: "successfully created user " });
			}

		} catch (error) {

			res.status(400).json({ message: "something went wrong" })
		}
	}

})


app.get('/get-order', middleware.decodeToken, async (req, res) => {
	const userid = req.query.userid;
	const data = await orderModel.find({ userId: userid })
	return res.json({ orders: data });
});





mongoose.connect(process.env.MONGO_URL)
	.then(() => {
		app.listen(PORT, () => {
			console.log("Server started on port no. " + PORT);
		});
	})
	.catch((error) => {
		console.log(error);
	})