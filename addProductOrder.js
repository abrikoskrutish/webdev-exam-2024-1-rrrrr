// фетч запрос на получение товара по айди
// айди берем из локал сторадж
// если товара нет, надпись Корзина пуста. Перейдите в каталог, чтобы добавить товары.
document.addEventListener('DOMContentLoaded', async () => {
    const catalog = document.querySelector('.self-catalog');
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

    if (selectedProducts.length === 0) {
        catalog.innerHTML = '<p>Корзина пуста. Перейдите в каталог, чтобы добавить товары.</p>';
        return;
    }

    for (const productId of selectedProducts) {
        try {
            const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods/${productId}?api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19`);
            const product = await response.json();

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

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-product';
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', () => {
                const updatedProducts = selectedProducts.filter(id => id !== product.id.toString());
                localStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
                // удаление карточки из DOM
                card.remove();
                if (updatedProducts.length === 0) {
                    catalog.innerHTML = '<p>Корзина пуста. Перейдите в каталог, чтобы добавить товары.</p>';
                }
            });

            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(rating);
            card.appendChild(price);
            card.appendChild(deleteButton);

            catalog.appendChild(card);
        } catch (error) {
            console.error('Ошибка при получении товара:', error);
        }
    }
});