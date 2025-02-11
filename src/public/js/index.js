const socket = io();
socket.on('realTimeProducts', data => {
    let contenidoHTML = "";
    let optionsHTML = "";
    data.forEach(item => {
        contenidoHTML += `
        <div class="col-md-4 mb-3">
            <div class="card">
                <img src="${item.image}" class="card-img-top img-thumbnail" style="max-width: 100px; max-height: 100px;" alt="${item.title}">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">Descripción: ${item.description}</p>
                    <p class="card-text">Categoría: ${item.category}</p>
                    <p class="card-text text-primary">Precio: $${item.price}</p>
                </div>
            </div>
        </div>`;
        optionsHTML += `<option value="${item.id}">Producto #${item.id} - ${item.title}</option>`;
    });
    document.getElementById("content").innerHTML = contenidoHTML;
    document.getElementById("producto_id").innerHTML = optionsHTML;
});

document.getElementById("producto-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;
    socket.emit("nuevoProducto", { title, description, code, price, category, image });
});

const eliminarProducto = () => {
    const id = document.getElementById("producto_id").value;
    socket.emit("eliminarProducto", id);
};
