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