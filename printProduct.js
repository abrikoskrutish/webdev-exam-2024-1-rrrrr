products = [];

async function loadProducts() {
    fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19`)
        .then(response => response.json())
        .then(data => {
            products = data;
            printProduct();
        });
}

loadProducts();

function printProduct() {
    const catalog = document.querySelector('.self-catalog');
    // парсим данные из LocalStorage в строку
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', product.id);
    
        const img = document.createElement('img');
        img.className = 'img-card';
        img.src = product.image_url;
        img.alt = product.name;
    
        const name = document.createElement('p');
        name.className = 'name-product';
        name.textContent = product.name;
    
        const rating = document.createElement('p');
        rating.textContent = product.rating;
    
        const price = document.createElement('p');
        price.textContent = `${product.actual_price}\u20BD`;
    
        const button = document.createElement('button');
        button.className = 'add-product';
        button.textContent = 'Добавить';
    
        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(rating);
        card.appendChild(price);
        card.appendChild(button);

        //если id есть в LocalStorage выделяем карточку
        if (selectedProducts.includes(product.id.toString())) {
            card.style.border = '2px solid rgb(162, 219, 249)';
        }

        catalog.appendChild(card);
    });

    // работа кнопок
    const buttons = document.querySelectorAll('.add-product');
    buttons.forEach(button => {
        button.addEventListener("click", event => {
            const card = event.target.closest('.card');
            const productId = card.getAttribute('data-id');

            card.style.border = '2px solid rgb(162, 219, 249)';

            // parse преобразование строки в объект
            let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
            if (!selectedProducts.includes(productId)) {
                selectedProducts.push(productId);
                // stringify преобразование объекта в строку
                localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
            }
        });
    });
}