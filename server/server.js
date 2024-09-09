const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3005;



const initializeDbAndServer = async () => {
    try {
        await mongoose.connect(mongoURI)
            .then(() => console.log("MongoDB Connected..."));

        app.listen(port, () => {
            console.log(`Server is running at port ${port}`);
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();


// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    gender: String,
});

// Define Product Schema
const productSchema = new mongoose.Schema({
    title: String,
    brand: String,
    price: Number,
    id: Number,
    image_url: String,
    rating: String,
    style: String,
    description: String,
    total_reviews: Number,
    availability: String


});

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);

function authenticateToken(request, response, next) {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        response.status(401).send("Invalid JWT Token");
    } else {
        jwt.verify(jwtToken, "MY_SECRET_TOKEN", (error, payload) => {
            if (error) {
                response.status(401).send("Invalid JWT Token");
            } else {
                request.email = payload.email;
                next();
            }
        });
    }
}

const validatePassword = (password) => {
    return password.length > 5;
};

// API to signup 
app.post("/signup", async (request, response) => {
    try {
        console.log("api hitted++++++");
        const { username, email, password, gender } = request.body;
        console.log(request.body);
        console.log(password);
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)

        const existingUser = await User.findOne({ email });
        console.log(existingUser);
        if (!existingUser) {
            if (validatePassword(password)) {
                const newUser = new User({ username, email, password: hashedPassword, gender });
                await newUser.save();
                response.send({ msg: "User created successfully" });
            } else {
                response.status(400).send({ err_msg: "Password is too short" });
            }
        } else {
            response.status(400).send({ err_msg: "User already exists" });
        }
    } catch (error) {
        response.status(500).send({ err_msg: "Internal Server Error" });
    }
});

// API to login
app.post("/login", async (request, response) => {
    try {
        const { email, password } = request.body;
        const user = await User.findOne({ email });
        if (!user) {
            response.status(400).send({ err_msg: "Invalid user" });
        } else {
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            if (isPasswordMatched) {
                const payload = { email: user.email };
                const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
                response.send({ jwtToken, ok: true });
            } else {
                response.status(400).send({ err_msg: "Invalid password" });
            }
        }
    } catch (error) {
        response.status(500).send({ err_msg: "Internal Server Error" });
    }
});


//API to get user
app.get("/user", authenticateToken, async (request, response)=>{
    try{
        const {email} = request;
        const user = await User.findOne({ email }, {_id: true, email: true});
        console.log("+++++++",user);
        response.send({userId: user._id});
    }catch(error){
        response.status(500).send({ err_msg: "Internal Server Error" });
    }
})

// API to GET all products 
app.get("/products/", authenticateToken, async (request, response) => {
    try {
        const { sort_by = "PRICE_HIGH" } = request.query;
        const order = sort_by === 'PRICE_HIGH' ? -1 : 1; // DESC: -1, ASC: 1
        const products = await Product.find().sort({ price: order });
        response.send({ products });
    } catch (error) {
        response.status(500).send({ err_msg: "Internal Server Error" });
    }
});

// API to GET a particular product
app.get("/products/:productId/", authenticateToken, async (request, response) => {
    try {
        const { productId } = request.params;
        console.log(productId);
        const product = await Product.findOne({ id: productId });
        if (product) {
            response.send(product);
        } else {
            response.status(404).send("Product not found");
        }
    } catch (error) {
        response.status(500).send({ err_msg: "Internal Server Error" });
    }
});

module.exports = app;
