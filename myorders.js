fetch("/api/orders")
.then(res => res.json())
.then(orders => {
const loggedUser = localStorage.getItem("loggedUser");
orders = orders.filter(order => order.name === loggedUser);
    const ordersList = document.getElementById("orders-list");

    if (orders.length === 0) {
        ordersList.innerHTML = "<h3>No Orders Found</h3>";
        return;
    }

    let html = "";

    orders.reverse().forEach(order => {

        html += `
        <div class="order-card">
            <h3>Order #${order.id}</h3>

            <p><b>Name:</b> ${order.name}</p>
            <p><b>Phone:</b> ${order.phone}</p>
            <p><b>Total:</b> ₹${order.total}</p>
            <p><b>Status:</b> ${order.status || "Pending"}</p>
            <p><b>Date:</b> ${order.date}</p>

            <h4>Items:</h4>
            <ul>
            ${order.items.map(item =>
                `<li>${item.name} × ${item.qty}</li>`
            ).join("")}
            </ul>

            <hr>
        </div>
        `;
    });

    ordersList.innerHTML = html;
});