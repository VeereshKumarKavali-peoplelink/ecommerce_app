const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const databasePath = path.join(__dirname, "userData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
    try {
        database = await open({
            filename: databasePath,
            driver: sqlite3.Database,
        });

        app.listen(3000, () =>
            console.log("Server Running at http://localhost:3000/")
        );
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();



function authenticateToken(request, response, next) {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.send("Invalid JWT Token");
    } else {
        jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
            if (error) {
                response.status(401);
                response.send("Invalid JWT Token");
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
        const { username, name, password, gender } = request.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const selectUserQuery = `SELECT * FROM user WHERE email = '${email}';`;
        const databaseUser = await database.get(selectUserQuery);

        if (databaseUser === undefined) {
            const createUserQuery = `
                        INSERT INTO
                                user (username, email, password, gender)
                        VALUES
                                    (
                                    '${username}',
                                    '${email}',
                                    '${hashedPassword}',
                                    '${gender}'
                                    );`;
            if (validatePassword(password)) {
                await database.run(createUserQuery);
                response.send("User created successfully");
            } else {
                response.status(400);
                response.send("Password is too short");
            }
        } else {
            response.status(400);
            response.send("User already exists");
        }
    } catch (error) {
        response.status(500).send({ err_msg: "Internal Server Error" })
    }

});


//API to login
app.post("/login", async (request, response) => {
    try {
        const { email, password } = request.body;
        const selectUserQuery = `SELECT * FROM user WHERE email = '${email}';`;
        const databaseUser = await database.get(selectUserQuery);
        if (databaseUser === undefined) {
            response.status(400);
            response.send("Invalid user");
        } else {
            const isPasswordMatched = await bcrypt.compare(
                password,
                databaseUser.password
            );
            if (isPasswordMatched === true) {
                const payload = {
                    email: email,
                };
                const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
                response.send({ jwtToken });
            } else {
                response.status(400);
                response.send("Invalid password");
            }
        }
    } catch (error) {
        response.status(500).send({ err_msg: "Internal Server Error" })
    }
});




//API to GET all products 
app.get("/products/", authenticateToken, async (request, response) => {
    try {
        const { sort_by = "PRICE_HIGH" } = request.query;
        const order = sort_by === 'PRICE_HIGH' ? 'DESC' : 'ASC';
        const getProductsQuery = `
        SELECT
          *
        FROM
          product
        ORDER BY price ${order};`;
        const productsArray = await database.all(getProductsQuery);
        response.send({ products: productsArray });
    } catch (error) {
        response.status(500).send({ err_msg: "Internal Server Error" })
    }
})


//API to GET a particular product
app.get("/products/:productId/", authenticateToken, async (request, response) => {
    try {
        const { productId } = request.params;
        const getProductQuery = `
          SELECT 
            *
          FROM 
            product
          WHERE 
            id = ${productId};`;
        const product = await database.get(getProductQuery);
        response.send({ product });
    } catch (error) {
        response.status(500).send({ err_msg: "Internal Server Error" })
    }
});



module.exports = app;
