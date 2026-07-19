const multer = require("multer");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"..")));
app.get("/",(req, res)=>{res.sendFile(path.join(__dirname,"..","index.html"));});
app.use("/images", express.static(path.join(__dirname, "images")));
// Products API
app.get("/api/products", (req, res) => {
    const filePath = path.join(__dirname, "products.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Products not found" });
        }

        res.json(JSON.parse(data));
    });
});
app.post("/api/products", (req, res) => {

    const newProduct = req.body;

    const filePath = path.join(__dirname, "products.json");

    fs.readFile(filePath, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({ message: "Error reading products" });
        }

        let products = JSON.parse(data);

        const nextId =
            products.length > 0
                ? Math.max(...products.map(p => p.id)) + 1
                : 1;

        newProduct.id = nextId;

        products.push(newProduct);

        fs.writeFile(
            filePath,
            JSON.stringify(products, null, 2),
            err => {

                if (err) {
                    return res.status(500).json({ message: "Error saving product" });
                }

                res.json({
                    message: "Product Added Successfully"
                });

            }
        );

    });

});
app.delete("/api/products/:id", (req, res) => {

    const id = Number(req.params.id);
    const filePath = path.join(__dirname, "products.json");

    fs.readFile(filePath, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({ message: "Error reading products" });
        }

        let products = JSON.parse(data);

        products = products.filter(product => product.id !== id);

        fs.writeFile(filePath, JSON.stringify(products, null, 2), err => {

            if (err) {
                return res.status(500).json({ message: "Error deleting product" });
            }

            res.json({ message: "Product Deleted Successfully" });

        });

    });

});
app.put("/api/products/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedProduct = req.body;

    const filePath = path.join(__dirname, "products.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading products" });
        }

        let products = JSON.parse(data);

        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({ message: "Product not found" });
        }

        products[index] = {
            ...products[index],
            ...updatedProduct,
            id
        };

        fs.writeFile(filePath, JSON.stringify(products, null, 2), err => {
            if (err) {
                return res.status(500).json({ message: "Error updating product" });
            }

            res.json({ message: "Product Updated Successfully" });
        });
    });
});
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    image: req.file.filename
  });
});
// Register User
app.post("/api/register", (req, res) => {

    const { name, email, password } = req.body;

    const filePath = path.join(__dirname, "users.json");

    fs.readFile(filePath, "utf8", (err, data) => {

        let users = [];

        if (!err && data) {
            users = JSON.parse(data);
        }

        const userExists = users.find(user => user.email === email);

        if (userExists) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            password
        };

        users.push(newUser);

        fs.writeFile(filePath, JSON.stringify(users, null, 2), err => {

            if (err) {
                return res.status(500).json({
                    message: "Error saving user"
                });
            }

            res.json({
                message: "Registration Successful"
            });

        });

    });

});
// Login User
app.post("/api/login", (req, res) => {

    const { email, password } = req.body;

    const filePath = path.join(__dirname, "users.json");

    fs.readFile(filePath, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading users"
            });
        }

        const users = JSON.parse(data || "[]");

        const user = users.find(u =>
            u.email === email &&
            u.password === password
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        res.json({
            message: "Login Successful",
            user
        });

    });

});
const PORT = 5000;
app.use(express.static(__dirname));
app.get("admin",(req, res)=>{res.sendFile(path.join(__dirname,"admin.html"));});
app.post("/api/orders", (req, res) => {

    const filePath = "./orders.json";

    let orders = [];

    if (fs.existsSync(filePath)) {
        orders = JSON.parse(fs.readFileSync(filePath));
    }

    orders.push({
        id: Date.now(),
        ...req.body,
        date: new Date().toLocaleString()
    });

    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    res.json({
        success: true,
        message: "Order Placed Successfully"
    });

});
app.put("/api/orders/status", (req, res) => {
    const filePath = "./orders.json";

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Orders file not found" });
    }

    let orders = JSON.parse(fs.readFileSync(filePath));

    const { id, status } = req.body;

    const order = orders.find(o => o.id == id);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    res.json({
        success: true,
        message: "Status Updated Successfully"
    });
});
app.get("/api/orders", (req, res) => {
    const filePath = "./orders.json";

    if (!fs.existsSync(filePath)) {
        return res.json([]);
    }

    const orders = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json(orders);
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

console.log(path.join(__dirname, "images"));