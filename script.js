let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
function addToCart(productName, productPrice) {

    cartItems.push({
        name: productName,
        price: productPrice,
        qty: 1
    });

    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    let cartCount = document.getElementById("cart-count");
    if (cartCount) {
        cartCount.innerText = cartItems.length;
    }

    alert(productName + " added to cart!");
}
function addToWishlist(productName) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (!wishlist.includes(productName)) {
        wishlist.push(productName);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert(productName + " added to Wishlist ❤️");
    } else {
        alert("Already in Wishlist ❤️");
    }
}
const searchBox = document.getElementById("SearchBox");

searchBox.addEventListener("keyup", function () {
    let value = searchBox.value.toLowerCase();
    let products = document.querySelectorAll(".product-card");

    products.forEach(function(product) {
        let name = product.querySelector("h2").innerText.toLowerCase();

        if (name.includes(value)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
});
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function addToWishlist(productName) {

    if (!wishlist.includes(productName)) {
        wishlist.push(productName);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert(productName + " added to Wishlist ❤️");
    } else {
        alert(productName + " is already in Wishlist ❤️");
    }

}
let loggedUser = localStorage.getItem("loggedUser");

if(loggedUser){

document.getElementById("userArea").innerHTML =
`<a href="#">👋 ${loggedUser}</a> |
<a href="#" onclick="logout()">Logout</a>`;

}

function logout(){

localStorage.removeItem("loggedIn");
localStorage.removeItem("loggedUser");

location.reload();

}

function toggleMenu(){
    document.getElementById("menu").classList.toggle("active");
}
let slideIndex = 0;
showSlides();

function showSlides(){

    let slides = document.getElementsByClassName("slides");

    for(let i=0;i<slides.length;i++){
        slides[i].style.display="none";
    }

    slideIndex++;

    if(slideIndex > slides.length){
        slideIndex = 1;
    }

    slides[slideIndex-1].style.display="block";

    setTimeout(showSlides,3000);

}
fetch("https://shoppingwebsite-crh7.onrender.com/api/products")
.then(response => response.json())
.then(products => {

    const productsDiv = document.getElementById("products");

    products.forEach(product => {

        productsDiv.innerHTML += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>₹${product.price}</p>

            <button onclick="addToWishlist('${product.name}')">
                ❤️ Wishlist
            </button>

            <button onclick="addToCart('${product.name}', ${product.price})">
                🛒 Add to Cart
            </button>

            <button onclick="window.location.href='${product.page}'">
                Buy Now
            </button>
        </div>
        `;
    });

})

.catch(error => console.log(error));
document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("loggedIn") === "true") {
        document.getElementById("myOrdersBtn").style.display = "block";
    }

});