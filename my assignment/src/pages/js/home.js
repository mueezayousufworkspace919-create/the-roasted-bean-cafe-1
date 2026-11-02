
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

function getCoffeeMenu() {
    try {
        const savedMenu = localStorage.getItem(STORAGE_KEY);

        if (savedMenu === null) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMenu));
            return defaultMenu;
        }

        const menu = JSON.parse(savedMenu);

        return Array.isArray(menu) ? menu : defaultMenu;

    } catch (error) {
        console.error("Menu loading error:", error);
        return defaultMenu;
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}

function displayCustomerMenu() {
    const container = document.getElementById("customerMenu");

    if (!container) return;

    const coffeeMenu = getCoffeeMenu();

    if (coffeeMenu.length === 0) {
        container.innerHTML = `
            <p class="col-span-full text-center text-stone-500 py-8">
                Our menu is currently being updated. Please visit again.
            </p>
        `;
        return;
    }

    const featuredCoffee = coffeeMenu.slice(0, 6);

    container.innerHTML = featuredCoffee.map(function(coffee) {
        return `
            <article class="coffee-card bg-white border border-[#efeae4] rounded-2xl overflow-hidden shadow-sm">

                <div class="bg-[#2c1810] text-center py-7">
                    <span class="text-5xl">☕</span>
                </div>

                <div class="p-6">

                    <div class="flex items-start justify-between gap-2 mb-3">
                        <h3 class="text-xl font-bold">
                            ${escapeHTML(coffee.name)}
                        </h3>

                        <span class="text-amber-700 font-extrabold whitespace-nowrap">
                            Rs. ${Number(coffee.price).toLocaleString("en-PK")}
                        </span>
                    </div>

                    <span class="inline-block bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                        ${escapeHTML(coffee.category)}
                    </span>

                    <p class="text-sm text-stone-600 leading-6">
                        ${escapeHTML(coffee.description)}
                    </p>

                </div>
            </article>
        `;
    }).join("");
}

document.addEventListener("DOMContentLoaded", function() {
    displayCustomerMenu();
});

window.addEventListener("storage", function(event) {
    if (event.key === STORAGE_KEY) {
        displayCustomerMenu();
    }
});
