let currentPage = 1;
let currentLimit = 3; // Mostrar 3 productos por página
let currentQuery = '';
let currentSort = '';

// Función para cargar productos
async function loadProducts(page = 1, limit = 3, query = '', sort = '') {
    const url = `/api/products?limit=${limit}&page=${page}&query=${query}&sort=${sort}`;
    console.log("URL de la solicitud:", url); // Depuración
    const response = await fetch(url);
    const data = await response.json();
    console.log("Datos recibidos:", data); // Depuración
    return data;
}

function renderProducts(products) {
    console.log("Productos a renderizar:", products); // Depuración
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
                    <button onclick="addToCart('${item._id}')" class="btn btn-primary">Agregar al carrito</button>
                </div>
            </div>
        </div>`;
    });
    document.getElementById("content").innerHTML = contenidoHTML;
}

function updatePagination(data) {
    document.getElementById("currentPage").textContent = `Página ${data.page}`;
    document.getElementById("prevPage").disabled = !data.hasPrevPage;
    document.getElementById("nextPage").disabled = !data.hasNextPage;
}

loadProducts(currentPage, currentLimit, currentQuery, currentSort)
    .then(data => {
        renderProducts(data.payload);
        updatePagination(data);
    });


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

document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    loadProducts(currentPage, currentLimit, currentQuery, currentSort)
        .then(data => {
            renderProducts(data.payload);
            updatePagination(data);
        });
});

document.getElementById("filterCategory").addEventListener("change", (e) => {
    currentQuery = e.target.value;
    currentPage = 1;
    loadProducts(currentPage, currentLimit, currentQuery, currentSort)
        .then(data => {
            renderProducts(data.payload);
            updatePagination(data);
        });
});


document.getElementById("sortPrice").addEventListener("change", (e) => {
    currentSort = e.target.value;
    currentPage = 1;
    loadProducts(currentPage, currentLimit, currentQuery, currentSort)
        .then(data => {
            renderProducts(data.payload);
            updatePagination(data);
        });
});

async function addToCart(productId) {
    const cartId = localStorage.getItem('cartId'); // Obtener el cartId desde localStorage
    if (!cartId) {
        alert('No se pudo obtener el carrito. Por favor, recarga la página.');
        return;
    }

    const quantity = 1; // Cantidad por defecto

    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
        });

        const result = await response.json();
        alert('Producto agregado al carrito');
        console.log(result);
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        alert('Hubo un error al agregar el producto al carrito');
    }
}

let cartId = localStorage.getItem('cartId'); // Obtener el cartId desde localStorage

// Si no hay un cartId, crear un nuevo carrito
if (!cartId) {
    async function createCart() {
        try {
            const response = await fetch('/api/carts', {
                method: 'POST',
            });
            const result = await response.json();
            cartId = result.payload._id; // Guardar el cartId
            localStorage.setItem('cartId', cartId); // Almacenar en localStorage
        } catch (error) {
            console.error('Error al crear el carrito:', error);
        }
    }
    createCart();
}

function goToCart() {
    const cartId = localStorage.getItem('cartId'); // Obtener el cartId desde localStorage
    if (cartId) {
        window.location.href = `/cart/${cartId}`; // Redirigir al carrito del usuario
    } else {
        alert('No se pudo obtener el carrito. Por favor, recarga la página.');
    }
}