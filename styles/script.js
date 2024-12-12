function showMessage() {
    event.preventDefault();
    document.getElementById("showMessageBtn").style.display = "none";
    document.getElementById("messageBox").style.display = "block";
    let deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // Delivery date 3 days from today
    document.getElementById("deliveryDate").textContent = deliveryDate.toDateString();
}

function closeMessage() {
    document.getElementById("messageBox").style.display = "none";
    document.getElementById("showMessageBtn").style.display = "inline-block";
}

function validateForm() {
    let form = document.getElementById("orderForm");
    if (form.checkValidity()) {
        showMessage();
        return false;
    } else {
        alert("Please fill in all required fields.");
        return false;
    }
}

function displayOrderSummary() {
    const cartItemsString = localStorage.getItem('cartItems') || '';
    const cartItems = cartItemsString ? cartItemsString.split(';') : [];
    const orderSummary = document.getElementById('orderSummary');
    const totalElement = document.getElementById('orderTotal');
    let total = 0;
    orderSummary.innerHTML = '';
    cartItems.forEach(itemString => {
        const [name, price, quantity] = itemString.split(',');
        const itemTotal = parseFloat(price) * parseInt(quantity);
        orderSummary.innerHTML += `
            <tr>
                <td>${name}</td>
                <td>${quantity}</td>
                <td>$${parseFloat(price).toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
            </tr>
        `;
        total += itemTotal;
    });
    totalElement.textContent = `$${total.toFixed(2)}`;
}

function handleOrder() {
    const form = document.getElementById('orderForm');
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const cardNumber = form.cardNumber.value;
    const expiryDate = form.expiryDate.value;
    const cvv = form.cvv.value;

    if (!name || !email || !phone || !address || !cardNumber || !expiryDate || !cvv) {
        alert("Please fill all fields!");
        return false;
    }

    const messageBox = document.getElementById('messageBox');
    const deliveryDate = document.getElementById('deliveryDate');
    messageBox.style.display = 'block';
    deliveryDate.textContent = '3-5 business days';

    // Remove cart items after the order is completed
    localStorage.removeItem('cartItems');
    return false;
}

function saveAsFavourite() {
    const cartItemsString = localStorage.getItem('cartItems') || '';
    localStorage.setItem('favouriteOrder', cartItemsString);
    alert("Order saved as favourite!");
}

function applyFavourites() {
    const favouriteOrderString = localStorage.getItem('favouriteOrder') || '';
    if (!favouriteOrderString) {
        alert("No favourite order found!");
        return;
    }

    // Apply favourite order to cart items
    localStorage.setItem('cartItems', favouriteOrderString);
    displayOrderSummary();
    alert("Favourite order applied!");
}

function closeMessage() {
    document.getElementById('messageBox').style.display = 'none';
}

window.onload = displayOrderSummary;

function addToCart(event) {
    const productName = event.target.dataset.product;
    const productPrice = parseFloat(event.target.dataset.price);
    const quantity = parseInt(event.target.previousElementSibling.querySelector('input').value);
    
    if (quantity > 0) {
        const item = { name: productName, price: productPrice, quantity, total: productPrice * quantity };
        let cartItemsString = localStorage.getItem('cartItems');
        let cartItems = cartItemsString ? cartItemsString.split(';') : [];
        cartItems.push(`${item.name},${item.price},${item.quantity},${item.total}`);
        localStorage.setItem('cartItems', cartItems.join(';'));
        updateCart(cartItems);
    } else {
        alert('Please enter a valid quantity');
    }
}

function updateCart(cartItems) {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalContainer = document.querySelector('tfoot td');
    let totalPrice = 0;
    cartItemsContainer.innerHTML = '';
    cartItems.forEach(itemString => {
        const [name, price, quantity, total] = itemString.split(',');
        const row = `<tr>
            <td>${name}</td>
            <td>$${parseFloat(price).toFixed(2)}</td>
            <td>${quantity}</td>
            <td>$${parseFloat(total).toFixed(2)}</td>
        </tr>`;
        cartItemsContainer.innerHTML += row;
        totalPrice += parseFloat(total);
    });
    totalContainer.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

function clearCart() {
    localStorage.removeItem('cartItems');
    updateCart([]);
}

document.querySelectorAll('.add-to-cart').forEach(button => button.addEventListener('click', addToCart));
document.getElementById('clearCartBtn').addEventListener('click', clearCart);

window.addEventListener('load', () => {
    const cartItemsString = localStorage.getItem('cartItems');
    const cartItems = cartItemsString ? cartItemsString.split(';') : [];
    updateCart(cartItems);
});
