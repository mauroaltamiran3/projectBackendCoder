const socket = io();

let currentPage = 1;
let currentLimit = 3;
let currentQuery = '';
let currentSort = '';

async function loadProducts(page = 1, limit = 3, query = '', sort = '') {
    const url = `/api/products?limit=${limit}&page=${page}&query=${query}&sort=${sort}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function renderProducts(products) {
    let contenidoHTML = "";
    products.forEach(item => {
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
    });
    document.getElementById("content").innerHTML = contenidoHTML;
}

//actualizar la paginación
function updatePagination(data) {
    document.getElementById("currentPage").textContent = `Página ${data.page}`;
    document.getElementById("prevPage").disabled = !data.hasPrevPage;
    document.getElementById("nextPage").disabled = !data.hasNextPage;
}

//mostrar productos al iniciar
loadProducts(currentPage, currentLimit, currentQuery, currentSort)
    .then(data => {
        renderProducts(data.payload);
        updatePagination(data);
    });

    //cambiar de página (Anterior)
    document.getElementById("prevPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadProducts(currentPage, currentLimit, currentQuery, currentSort)
                .then(data => {
                    renderProducts(data.payload);
                    updatePagination(data);
                });
        }
    });

    //cambiar de página (Siguiente)
    document.getElementById("nextPage").addEventListener("click", () => {
        currentPage++;
        loadProducts(currentPage, currentLimit, currentQuery, currentSort)
            .then(data => {
                renderProducts(data.payload);
                updatePagination(data);
            });
    });

    //filtro por categoría
    document.getElementById("filterCategory").addEventListener("change", (e) => {
        currentQuery = e.target.value;
        currentPage = 1;
        loadProducts(currentPage, currentLimit, currentQuery, currentSort)
            .then(data => {
                renderProducts(data.payload);
                updatePagination(data);
            });
    });

    //ordenamiento por precio
    document.getElementById("sortPrice").addEventListener("change", (e) => {
        currentSort = e.target.value;
        currentPage = 1; 
        loadProducts(currentPage, currentLimit, currentQuery, currentSort)
            .then(data => {
                renderProducts(data.payload);
                updatePagination(data);
            });
    });

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
        optionsHTML += `<option value="${item._id}">Producto #${item._id} - ${item.title}</option>`;
    });
    document.getElementById("content").innerHTML = contenidoHTML;
    document.getElementById("producto_id").innerHTML = optionsHTML;
});

document.getElementById("producto-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const image = document.getElementById("image").value;

    if (!title || !description || !code || !price || !category || !image) {
        alert("Todos los campos son obligatorios");
        return;
    }

    if (isNaN(price) || price <= 0) {
        alert("El precio debe ser un número mayor a 0");
        return;
    }

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, code, price, category, image }),
        });

        const result = await response.json();

        const errorMessage = document.getElementById("error-message");

        if (result.status === 'error') {
            // Mostrar el mensaje de error en el div
            errorMessage.textContent = result.message;
            errorMessage.style.display = 'block'; // Mostrar el div
        } else {
            // Ocultar el mensaje de error y mostrar un mensaje de éxito
            errorMessage.style.display = 'none'; // Ocultar el div
            alert('Producto agregado correctamente.');
            document.getElementById("producto-form").reset();
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        alert('Hubo un error al agregar el producto.');
    }
});

const eliminarProducto = async () => {
    const id = document.getElementById("producto_id").value;

    if (!id || id === "undefined") {
        alert("Por favor, selecciona un producto válido para eliminar.");
        return;
    }

    try {
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const result = await response.json();

        if (result.status === 'success') {
            alert("Producto eliminado correctamente.");
            location.reload(); // Recargar la lista
        } else {
            alert("Error al eliminar el producto.");
        }
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        alert("Hubo un error al eliminar el producto.");
    }
};

