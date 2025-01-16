document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const cancelButton = document.getElementById('cancel-button');
    const catalog = document.querySelector('.self-catalog');
    const toggleCategoriesButton = document.getElementById('toggle-categories');
    const categoryFilter = document.querySelector('.category-filter');
    let timeout = null;


    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'autocomplete-container';
    document.body.appendChild(autocompleteContainer);


    const showAutocomplete = (suggestions) => {
        autocompleteContainer.innerHTML = '';
        if (Array.isArray(suggestions)) {
            suggestions.forEach(suggestion => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.textContent = suggestion;
                item.addEventListener('click', () => {
                    const words = searchInput.value.split(' ');
                    words.pop();
                    words.push(suggestion);
                    searchInput.value = words.join(' ');
                    autocompleteContainer.style.display = 'none';
                });
                autocompleteContainer.appendChild(item);
            });
            autocompleteContainer.style.display = 'block';
            const rect = searchInput.getBoundingClientRect();
            autocompleteContainer.style.left = `${rect.left}px`;
            autocompleteContainer.style.top = `${rect.bottom}px`;
            autocompleteContainer.style.width = `${rect.width}px`;
        }
    };


    const fetchAutocomplete = async (query) => {
        try {
            const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/autocomplete?query=${query}&api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19`);
            const suggestions = await response.json();
            showAutocomplete(suggestions);
        } catch (error) {
            console.error('Ошибка при получении автодополнений:', error);
        }
    };


    searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        const query = searchInput.value.trim();
        if (query.length > 0) {
            timeout = setTimeout(() => fetchAutocomplete(query), 300);
        } else {
            autocompleteContainer.style.display = 'none';
        }
    });

    // найти
    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            try {
                const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?query=${query}&api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19`);
                const products = await response.json();
                catalog.innerHTML = '';
                if (products.length > 0) {
                    products.forEach(product => {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.innerHTML = `
                            <img src="${product.image_url}" alt="${product.name}">
                            <p>${product.name}</p>
                            <p>${product.rating}</p>
                            <p>${product.actual_price}\u20BD</p>
                            <button class="add-product" data-id="${product.id}">Добавить</button>
                        `;
                        catalog.appendChild(card);
                    });
                    // обработчик для добавить
                    document.querySelectorAll('.add-product').forEach(button => {
                        button.addEventListener('click', (event) => {
                            const productId = event.target.getAttribute('data-id');
                            let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
                            if (!selectedProducts.includes(productId)) {
                                selectedProducts.push(productId);
                                localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
                                event.target.closest('.card').style.border = '2px solid rgb(162, 219, 249)';
                            } else {
                                event.target.closest('.card').style.border = '2px solid rgb(162, 219, 249)';
                            }
                        });
                    });
                } else {
                    catalog.innerHTML = '<p>Нет товаров, соответствующих вашему запросу</p>';
                }
            } catch (error) {
                console.error('Ошибка при поиске товаров:', error);
            }
        }
    });

    // отмена
    cancelButton.addEventListener('click', () => {
        searchInput.value = '';
        autocompleteContainer.style.display = 'none';
        window.location.reload(); 
    });


    document.addEventListener('click', (event) => {
        if (!autocompleteContainer.contains(event.target) && event.target !== searchInput) {
            autocompleteContainer.style.display = 'none';
        }
    });

    // скрытие категорий для адаптивности
    toggleCategoriesButton.addEventListener('click', () => {
        if (categoryFilter.style.display === 'none' || !categoryFilter.style.display) {
            categoryFilter.style.display = 'block';
            toggleCategoriesButton.textContent = 'Скрыть категории';
        } else {
            categoryFilter.style.display = 'none';
            toggleCategoriesButton.textContent = 'Показать категории';
        }
    });

    const handleResize = () => {
        if (window.innerWidth > 650) {
            toggleCategoriesButton.style.display = 'none';
            categoryFilter.style.display = 'block';
        } else {
            toggleCategoriesButton.style.display = 'block';
            categoryFilter.style.display = 'none';
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
});