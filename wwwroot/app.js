const STORAGE_KEY = 'recetas_app_v2';

document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
    renderRecipes();
});

function getStoredRecipes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveStoredRecipes(recipes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    renderRecipes();
}

function loadInitialData() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([{
            id: "1",
            title: "Sancocho",
            category: "Almuerzo",
            prepTimeMinutes: 120,
            ingredients: "Carne, Yucca",
            instructions: "Hervir"
        }]));
    }
}

document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('recipeId').value;
    const recipeData = {
        id: id || crypto.randomUUID(),
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        prepTimeMinutes: parseInt(document.getElementById('prepTimeMinutes').value),
        ingredients: document.getElementById('ingredients').value,
        instructions: document.getElementById('instructions').value
    };

    try {
        // Nota: Asegúrate de tener tu backend corriendo para que esta petición fetch funcione,
        // de lo contrario, puedes omitir la llamada a la API si solo usas LocalStorage.
        const response = await fetch('/api/recipes', {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeData)
        });

        if (response.ok) {
            let recipes = getStoredRecipes();
            if (id) {
                recipes = recipes.map(r => r.id === id ? recipeData : r);
            } else {
                recipes.push(recipeData);
            }
            saveStoredRecipes(recipes);
            resetForm();
        }
    } catch (error) {
        console.error("Error conectando con la API:", error);
    }
});

function renderRecipes(filterText = '') {
    const container = document.getElementById('recipesList');
    const recipes = getStoredRecipes().filter(r =>
        r.title.toLowerCase().includes(filterText.toLowerCase())
    );

    container.innerHTML = recipes.map(r => `
        <div class="col-md-6 mb-3">
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <span class="badge bg-info text-dark float-end">${r.category}</span>
                    <h5 class="card-title">${r.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">⏱️ ${r.prepTimeMinutes} mins</h6>
                    <p class="card-text"><strong>Ingredientes:</strong> ${r.ingredients}</p>
                    <p class="card-text"><strong>Pasos:</strong> ${r.instructions}</p>
                    <button class="btn btn-sm btn-warning" onclick="editRecipe('${r.id}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteRecipe('${r.id}')">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterRecipes() {
    renderRecipes(document.getElementById('searchInput').value);
}

function editRecipe(id) {
    const recipe = getStoredRecipes().find(r => r.id === id);
    if (!recipe) return;

    document.getElementById('recipeId').value = recipe.id;
    document.getElementById('title').value = recipe.title;
    document.getElementById('category').value = recipe.category;
    document.getElementById('prepTimeMinutes').value = recipe.prepTimeMinutes;
    document.getElementById('ingredients').value = recipe.ingredients;
    document.getElementById('instructions').value = recipe.instructions;

    document.getElementById('formTitle').innerText = 'Editar Receta';
    document.getElementById('btnCancel').classList.remove('d-none');
}

async function deleteRecipe(id) {
    if (!confirm('¿Eliminar receta?')) return;

    try {
        await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
        saveStoredRecipes(getStoredRecipes().filter(r => r.id !== id));
    } catch (error) {
        console.error("Error eliminando en la API:", error);
    }
}

function resetForm() {
    document.getElementById('recipeForm').reset();
    document.getElementById('recipeId').value = '';
    document.getElementById('formTitle').innerText = 'Nueva Receta';
    document.getElementById('btnCancel').classList.add('d-none');
}