
// ==========================================
// THE ROASTED BEAN - DEVELOPER CRUD SYSTEM
// ==========================================

const STORAGE_KEY = "roastedBeanCoffeeMenu";

const defaultMenu = [
    {
        id: 1,
        name: "Signature Latte",
        category: "Hot Coffee",
        price: 650,
        description: "Smooth espresso blended with steamed milk."
    },
    {
        id: 2,
        name: "Iced Coffee",
        category: "Cold Coffee",
        price: 550,
        description: "Chilled coffee with a refreshing finish."
    },
    {
        id: 3,
        name: "Classic Cappuccino",
        category: "Hot Coffee",
        price: 600,
        description: "Rich espresso with creamy milk foam."
    }
];

// Get elements
const coffeeForm = document.getElementById("coffeeForm");
const coffeeName = document.getElementById("coffeeName");
const coffeeCategory = document.getElementById("coffeeCategory");
const coffeePrice = document.getElementById("coffeePrice");
const coffeeDescription = document.getElementById("coffeeDescription");
const editId = document.getElementById("editId");
const coffeeContainer = document.getElementById("coffeeContainer");
const formHeading = document.getElementById("formHeading");
const submitButton = document.getElementById("submitButton");
const cancelEdit = document.getElementById("cancelEdit");
const formMessage = document.getElementById("formMessage");
const searchCoffee = document.getElementById("searchCoffee");
const filterCategory = document.getElementById("filterCategory");
const resetMenu = document.getElementById("resetMenu");

// Load saved menu
function getMenu() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMenu));
            return [...defaultMenu];
        }

        const menu = JSON.parse(saved);
        return Array.isArray(menu) ? menu : [...defaultMenu];

    } catch (error) {
        console.error("Storage error:", error);
        return [...defaultMenu];
    }
}

let coffeeMenu = getMenu();

// Save menu to Local Storage
function saveMenu() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coffeeMenu));
}

// Protect displayed text
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// Display coffee records
function displayMenu(menu = coffeeMenu) {
    if (!coffeeContainer) return;

    if (menu.length === 0) {
        coffeeContainer.innerHTML = `
            <p class="text-center text-stone-500 col-span-full py-8">
                No coffee records found.
            </p>`;
        updateStatistics();
        return;
    }

    coffeeContainer.innerHTML = menu.map(coffee => `
        <div class="bg-white rounded-xl shadow-sm border border-stone-200 p-5">
            <div class="flex justify-between items-start gap-3">
                <h3 class="text-lg font-bold text-[#2c1810]">
                    ${escapeHTML(coffee.name)}
                </h3>
                <span class="font-bold text-amber-700 whitespace-nowrap">
                    Rs. ${Number(coffee.price).toLocaleString("en-PK")}
                </span>
            </div>

            <p class="text-xs font-bold text-amber-800 bg-amber-100 inline-block px-3 py-1 rounded-full mt-3">
                ${escapeHTML(coffee.category)}
            </p>

            <p class="text-sm text-stone-600 mt-3">
                ${escapeHTML(coffee.description)}
            </p>

            <div class="flex gap-3 mt-5">
                <button
                    type="button"
                    class="edit-btn bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold"
                    data-id="${coffee.id}">
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold"
                    data-id="${coffee.id}">
                    Delete
                </button>
            </div>
        </div>
    `).join("");

    updateStatistics();
}

// Update statistics
function updateStatistics() {
    const total = coffeeMenu.length;

    const premium = coffeeMenu.filter(coffee =>
        Number(coffee.price) >= 1000
    ).length;

    const validPrices = coffeeMenu.filter(coffee =>
        Number(coffee.price) > 0
    ).length;

    const totalElement = document.getElementById("totalProducts");
    const premiumElement = document.getElementById("premiumProducts");
    const validElement = document.getElementById("validProducts");

    if (totalElement) totalElement.textContent = total;
    if (premiumElement) premiumElement.textContent = premium;
    if (validElement) validElement.textContent = validPrices;

    // Required array methods
    const hasCoffee = coffeeMenu.some(coffee => coffee.name);
    const allPricesValid = coffeeMenu.every(coffee =>
        Number(coffee.price) > 0
    );

    console.log("Menu contains coffee:", hasCoffee);
    console.log("All prices valid:", allPricesValid);
}

// Reset form
function clearForm() {
    if (!coffeeForm) return;

    coffeeForm.reset();
    if (editId) editId.value = "";

    if (formHeading) formHeading.textContent = "Add New Coffee";
    if (submitButton) submitButton.textContent = "Add Coffee";
    if (cancelEdit) cancelEdit.classList.add("hidden");
    if (formMessage) formMessage.textContent = "";
}

// ADD AND UPDATE
if (coffeeForm) {
    coffeeForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = coffeeName.value.trim();
        const category = coffeeCategory.value;
        const price = Number(coffeePrice.value);
        const description = coffeeDescription.value.trim();
        const currentId = editId.value;

        if (!name || !category || !description || !Number.isFinite(price) || price <= 0) {
            if (formMessage) {
                formMessage.textContent = "Please enter valid information in all fields.";
                formMessage.className = "text-red-600 mt-3";
            }
            return;
        }

        if (currentId) {
            // UPDATE existing coffee
            const coffee = coffeeMenu.find(item =>
                String(item.id) === String(currentId)
            );

            if (!coffee) {
                if (formMessage) formMessage.textContent = "Coffee record not found.";
                return;
            }

            coffee.name = name;
            coffee.category = category;
            coffee.price = price;
            coffee.description = description;

            if (formMessage) {
                formMessage.textContent = "Coffee updated successfully!";
                formMessage.className = "text-green-700 mt-3";
            }

        } else {
            // CREATE new coffee
            const newCoffee = {
                id: Date.now(),
                name: name,
                category: category,
                price: price,
                description: description
            };

            coffeeMenu.push(newCoffee);

            if (formMessage) {
                formMessage.textContent = "Coffee added successfully!";
                formMessage.className = "text-green-700 mt-3";
            }
        }

        saveMenu();
        displayMenu();
        clearForm();
    });
}

// EDIT AND DELETE using event delegation
if (coffeeContainer) {
    coffeeContainer.addEventListener("click", function(event) {
        const editButton = event.target.closest(".edit-btn");
        const deleteButton = event.target.closest(".delete-btn");

        if (editButton) {
            const id = editButton.dataset.id;

            const coffee = coffeeMenu.find(item =>
                String(item.id) === String(id)
            );

            if (!coffee) return;

            // Put selected record into the form
            coffeeName.value = coffee.name;
            coffeeCategory.value = coffee.category;
            coffeePrice.value = coffee.price;
            coffeeDescription.value = coffee.description;
            editId.value = coffee.id;

            if (formHeading) formHeading.textContent = "Edit Coffee";
            if (submitButton) submitButton.textContent = "Save Changes";
            if (cancelEdit) cancelEdit.classList.remove("hidden");

            if (formMessage) {
                formMessage.textContent = "Edit the details and click Save Changes.";
                formMessage.className = "text-amber-700 mt-3";
            }

            // Scroll to form
            coffeeForm.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        if (deleteButton) {
            const id = deleteButton.dataset.id;

            const confirmed = confirm("Are you sure you want to delete this coffee?");

            if (!confirmed) return;

            coffeeMenu = coffeeMenu.filter(item =>
                String(item.id) !== String(id)
            );

            saveMenu();
            displayMenu();

            if (editId && String(editId.value) === String(id)) {
                clearForm();
            }
        }
    });
}

// CANCEL EDIT
if (cancelEdit) {
    cancelEdit.addEventListener("click", clearForm);
}

// SEARCH AND CATEGORY FILTER
function filterMenu() {
    const searchText = searchCoffee
        ? searchCoffee.value.toLowerCase().trim()
        : "";

    const selectedCategory = filterCategory
        ? filterCategory.value
        : "";

    const filteredMenu = coffeeMenu.filter(coffee => {
        const matchesSearch =
            coffee.name.toLowerCase().includes(searchText) ||
            coffee.description.toLowerCase().includes(searchText);

        const matchesCategory =
            !selectedCategory || coffee.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayMenu(filteredMenu);

    const searchMessage = document.getElementById("searchMessage");

    if (searchMessage) {
        searchMessage.textContent =
            filteredMenu.length === 0 ? "No matching coffee found." : "";
    }
}

if (searchCoffee) {
    searchCoffee.addEventListener("input", filterMenu);
}

if (filterCategory) {
    filterCategory.addEventListener("change", filterMenu);
}

// RESET MENU
if (resetMenu) {
    resetMenu.addEventListener("click", function() {
        const confirmed = confirm("Restore the original coffee menu?");

        if (!confirmed) return;

        coffeeMenu = defaultMenu.map(coffee => ({ ...coffee }));

        saveMenu();
        displayMenu();
        clearForm();

        if (searchCoffee) searchCoffee.value = "";
        if (filterCategory) filterCategory.value = "";
    });
}

// ==========================================
// AXIOS API INTEGRATION
// ==========================================

async function loadCoffeeAPI() {
    const apiContainer = document.getElementById("apiContainer");
    const apiStatus = document.getElementById("apiStatus");

    if (!apiContainer || !apiStatus) return;

    apiStatus.textContent = "Loading coffee data...";
    apiContainer.innerHTML = "";

    try {
        const response = await axios.get(
            "https://api.sampleapis.com/coffee/hot",
            { timeout: 15000 }
        );

        const apiCoffee = response.data;

        if (!Array.isArray(apiCoffee) || apiCoffee.length === 0) {
            throw new Error("No coffee data was received.");
        }

        const displayedCoffee = apiCoffee.slice(0, 6);

        apiContainer.innerHTML = displayedCoffee.map(coffee => `
            <div class="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
                <h3 class="font-bold text-lg text-[#2c1810]">
                    ${escapeHTML(coffee.title || "Coffee")}
                </h3>
                <p class="text-sm text-stone-600 mt-2">
                    ${escapeHTML(
                        Array.isArray(coffee.ingredients)
                            ? coffee.ingredients.join(", ")
                            : "Ingredients information unavailable."
                    )}
                </p>
            </div>
        `).join("");

        apiStatus.textContent = "Coffee data loaded successfully.";

    } catch (error) {
        console.error("API Error:", error);

        apiStatus.textContent =
            "Unable to load coffee data. Please check your internet connection.";

        apiContainer.innerHTML = `
            <p class="text-red-600 py-4">
                API data could not be loaded. Please try again.
            </p>`;
    }
}

const reloadApi = document.getElementById("reloadApi");

if (reloadApi) {
    reloadApi.addEventListener("click", loadCoffeeAPI);
}

// INITIAL PAGE LOAD
document.addEventListener("DOMContentLoaded", function() {
    displayMenu();
    loadCoffeeAPI();
});
