document.addEventListener("DOMContentLoaded", async function () {
  // Variables globales
  let token = localStorage.getItem("token");
  let products = await loadSampleProducts();
  let editingId = null;

  // Elementos del DOM
  const productForm = document.getElementById("product-form");
  const productIdInput = document.getElementById("product-id");
  const brandInput = document.getElementById("brand");
  const modelInput = document.getElementById("model");
  const priceInput = document.getElementById("price");
  const stockInput = document.getElementById("stock");
  const saveBtn = document.getElementById("save-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const formTitle = document.getElementById("form-title");

  const filterBrand = document.getElementById("filter-brand");
  const filterMinPrice = document.getElementById("filter-min-price");
  const filterMaxPrice = document.getElementById("filter-max-price");
  const filterId = document.getElementById("filter-id");
  const applyFiltersBtn = document.getElementById("apply-filters");
  const resetFiltersBtn = document.getElementById("reset-filters");

  const productsTable = document
    .getElementById("products-list")
    .getElementsByTagName("tbody")[0];

  // Event Listeners
  productForm.addEventListener("submit", handleFormSubmit);
  cancelBtn.addEventListener("click", cancelEdit);
  applyFiltersBtn.addEventListener("click", applyFilters);
  resetFiltersBtn.addEventListener("click", resetFilters);

  // Cargar productos de ejemplo al inicio
  loadSampleProducts();
  console.log(products);

  renderProducts(products);

  // Funciones

  async function loadSampleProducts() {
    const res = await fetch(
      "https://ecommerce-api-y8cy.onrender.com/api/products",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const product = {
      category: brandInput.value,
      name: modelInput.value,
      price: parseFloat(priceInput.value),
      stock: parseInt(stockInput.value),
    };
    if (editingId) {
      // Editar producto existente
      product.id = editingId;
      updateProduct(product);
      const productsRender = await loadSampleProducts();
      resetForm();
      return renderProducts(productsRender);
    }
    const res = await fetch(
      "https://ecommerce-api-y8cy.onrender.com/api/products/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      }
    );
    const productsRender = await loadSampleProducts();
    resetForm();
    return renderProducts(productsRender);
  }

  async function updateProduct(updatedProduct) {
    const { id, category, name, stock, price } = updatedProduct;
    let product = {
      category,
      name,
      stock,
      price,
    };

    try {
      const res = await fetch(
        `https://ecommerce-api-y8cy.onrender.com/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        }
      );

      const data = await res.json();
      console.log(data);
      editingId = null;
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteProduct(id) {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        const res = await fetch(
          `https://ecommerce-api-y8cy.onrender.com/api/products/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        const productsRender = await loadSampleProducts();
        console.log(data);
        renderProducts(productsRender);
      } catch (err) {
        console.log(err.message);
      }
    }
  }

   async function editProduct(id) {
       const productsRender = await loadSampleProducts();
       const product = productsRender.find((p) => p.id === id);
       
    if (product) {
      editingId = id;
      productIdInput.value = product.id;
      brandInput.value = product.category;
      modelInput.value = product.name;
      priceInput.value = product.price;
      stockInput.value = product.stock;

      formTitle.textContent = "Editar Producto";
      saveBtn.textContent = "Actualizar";
      cancelBtn.style.display = "inline-block";
    }
  }

  function cancelEdit() {
    resetForm();
  }

  function resetForm() {
    productForm.reset();
    productIdInput.value = "";
    editingId = null;
    formTitle.textContent = "Agregar Nuevo Producto";
    saveBtn.textContent = "Guardar";
    cancelBtn.style.display = "none";
  }

  async function applyFilters() {
    const productsRender = await loadSampleProducts();

    // Filtrar por ID
    if (filterId.value) {
      let id = filterId.value;
      try {
        const res = await fetch(
          `https://ecommerce-api-y8cy.onrender.com/api/products/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data);
        resetFilters();
        return renderProducts([data]);
      } catch (err) {
        console.log(err.message);
      }
    }
    //Filtrar todas las marcas
    if(filterBrand.value.length === 0){
      resetFilters();
      return renderProducts(productsRender);
    }

    // Filtrar por marca
    if (filterBrand.value) {
      const category = filterBrand.value;

      try {
        const res = await fetch(
          `https://ecommerce-api-y8cy.onrender.com/api/products-category?category=${category}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        resetFilters();
        return renderProducts(data);
      } catch (err) {
        console.log(err.message);
      }
    }
    
    //Filtrar por precio minimo y mayor
    if (filterMaxPrice.value && filterMinPrice.value) {
      const productFilter = productsRender.filter((product) => {
        return (
          product.price >= filterMinPrice.value && product.price <= filterMaxPrice.value
        );
      });
      resetFilters();
      return renderProducts(productFilter);
    }
    //Filtrar por precio mayor
    if (filterMaxPrice.value) {
      const productFilter = productsRender.filter((product) => {
        return product.price <= filterMaxPrice.value;
      });
      resetFilters();
      return renderProducts(productFilter);
    }
    // Filtrar por precio menor
    if (filterMinPrice.value) {
      const productFilter = productsRender.filter((product) => {
        return product.price >= filterMinPrice.value;
      });
      resetFilters();
      return renderProducts(productFilter);
    }
  }

  function resetFilters() {
    filterBrand.value = "";
    filterMinPrice.value = "";
    filterMaxPrice.value = "";
    filterId.value = "";
  }

  function renderProducts(productsToRender) {
    productsTable.innerHTML = "";
    if (productsToRender.length < 1) {
      const row = productsTable.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 6;
      cell.textContent = "No se encontraron productos";
      cell.style.textAlign = "center";
      return;
    }

    productsToRender.forEach((product) => {
      const row = productsTable.insertRow();

      row.insertCell().textContent = product.id;
      row.insertCell().textContent = product.name;
      row.insertCell().textContent = product.category;
      row.insertCell().textContent = `$${product.price.toFixed(2)}`;
      row.insertCell().textContent = product.stock;

      const actionsCell = row.insertCell();

      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.className = "action-btn edit-btn";
      editBtn.addEventListener("click", async() => await editProduct(product.id));
      actionsCell.appendChild(editBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Eliminar";
      deleteBtn.className = "action-btn delete-btn";
      deleteBtn.addEventListener("click", async() => await deleteProduct(product.id));
      actionsCell.appendChild(deleteBtn);
    });
  }
});
