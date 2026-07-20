let editId = null;
async function addProduct() {

const name = document.getElementById("name").value;
const price = document.getElementById("price").value;
const page = document.getElementById("page").value;

const imageFile = document.getElementById("image").files[0];

const formData = new FormData();
formData.append("image", imageFile);

const uploadRes = await fetch("https://shoppingwebsite-crh7.onrender.com/upload", {
    method: "POST",
    body: formData
});

const uploadData = await uploadRes.json();
const image = "https://shoppingwebsite-crh7.onrender.com/images/" +uploadData.image;

    const product = {
        name,
        price: Number(price),
        image,
        page
    };

    let response;

if (editId) {
    response = await fetch(`https://shoppingwebsite-crh7.onrender.com/api/products/${editId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });

    editId = null;
} else {
    response = await fetch("https://shoppingwebsite-crh7.onrender.com/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

const data = await response.json();
alert(data.message);
loadProducts();
}
async function loadProducts() {

    const response = await fetch("https://shoppingwebsite-crh7.onrender.com/api/products");
    const products = await response.json();

    const tbody = document.querySelector("#productTable tbody");

    tbody.innerHTML = "";

    products.forEach(product => {

tbody.innerHTML += `
<tr>
    <td>${product.id}</td>
    <td><img src="${product.image}" width="60"></td>
    <td>${product.name}</td>
    <td>₹${product.price}</td>
   <td>
   <button class="edit-btn" onclick="editProduct(${product.id})">✏ Edit</button>

<button class="delete-btn" onclick="deleteProduct(${product.id})">🗑 Delete</button>
</td>
</tr>
`;

    });

}

loadProducts();
async function deleteProduct(id) {

    if (!confirm("Delete this product?")) return;

    const response = await fetch(`https://shoppingwebsite-crh7.onrender.com/api/products/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    alert(data.message);

    loadProducts();
}
function editProduct(id) {
editId = id;
document.getElementById("saveBtn").innerText = "Update Product";
    fetch("https://shoppingwebsite-crh7.onrender.com/api/products")
    .then(res => res.json())
    .then(products => {

       let product = products.find(p => Number(p.id) === Number(id));
console.log(product);
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price;
        document.getElementById("image").value = product.image;
        document.getElementById("page").value = product.page;

    });

}
async function loadOrders() {
    const response = await fetch("https://shoppingwebsite-crh7.onrender.com/api/orders");
    const orders = await response.json();

    const ordersList = document.getElementById("ordersList");

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <h3>Order #${order.id}</h3>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Status:</strong> ${order.status || "Pending"}</p>
            <div class="order-actions">
    <button onclick="updateStatus('${order.id}','Accepted')">✅ Accept</button>
    <button onclick="updateStatus('${order.id}','Packed')">📦 Packed</button>
    <button onclick="updateStatus('${order.id}','Shipped')">🚚 Shipped</button>
    <button onclick="updateStatus('${order.id}','Delivered')">🎉 Delivered</button>
    <button onclick="updateStatus('${order.id}','Cancelled')">❌ Cancel</button>
</div>
            <h4>Items:</h4>
<ul>
${order.items.map(item => `
<li>${item.name} × ${item.qty}</li>
`).join("")}
</ul>
            <hr>
        </div>
    `).join("");
}
loadOrders();
async function updateStatus(id, status) {
    await fetch("https://shoppingwebsite-crh7.onrender.com/api/orders/status", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            status: status
        })
    });

    loadOrders();
}