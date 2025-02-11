const socket = io();

socket.on("realTimeProducts", data => {
    limpiarSelectEliminarProducto();
    let contenidoHTML = "";

    data.forEach(item => {
        contenidoHTML += `
        <div class="col-md-3">
            <div class="card text-center border-0 fw-light">
                <img src="${item.thumbnail}" class="img-fluid" alt="${item.title}">
                <div class="card-body">
                    <p class="card-text">${item.title}</p>
                    <p class="card-text">$${item.price}</p>
                </div>
            </div>
        </div>`;

        agregarItemEliminarProducto();
    });

    contenidoHTML += "</ul>";
    document.getElementById("content").innerHTML = contenidoHTML;
});

const agregarProducto = () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;
    const producto = {
        title,
        description,
        code,
        price,
        category,
        image
    };
    socket.emit("nuevoProducto", producto);
    title.value = '';
    description.value = '';
    code.value = '';
    category.value = '';
    image.value = '';
    document.getElementById("producto_estado1").innerHTML = `<div class="alert alert-success" role="alert">Producto agregado correctamente</div>`;
}

const limpiarSelectEliminarProducto = () => {
    const productId = document.getElementById("producto_id");
    productId.innerHTML = '';
}

const agregarItemEliminarProducto = (item) => {
    const productId = document.getElementById("producto_id");
    let option = document.createElement("option");
    option.value = item.id;
    option.innerHTML = `Producto #${item.id}`;
    productId.appendChild(option);
}

const eliminarProducto = () => {
    const producto_id = document.getElementById("producto_id").value;
    socket.emit("eliminarProducto", producto_id);
    document.getElementById("producto_estado1").innerHTML = `<div class="alert alert-success" role="alert">Producto eliminado correctamente</div>`;
}
