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

    // Обработка отправки формы
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Останавливаем отправку формы

        // Получаем данные формы
        const formData = new FormData(form);
        const deliveryDate = new Date(formData.get('delivery_date')).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const data = {
            full_name: formData.get('full_name'),
            delivery_address: formData.get('delivery_address'),
            phone: formData.get('phone'),
            delivery_date: deliveryDate, // Преобразуем дату в формат dd.mm.yyyy
            email: formData.get('email'),
            delivery_interval: formData.get('delivery_interval'),
            comment: formData.get('comment'),
            good_ids: selectedProducts.map(id => parseInt(id)), // Преобразуем id товаров в числа
            subscribe: formData.get('mailing') === 'yes' ? 1 : 0, // Преобразуем значение в 0 или 1
        };

        console.log('Отправляемые данные:', data);

        try {
            const response = await fetch('https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Заказ успешно оформлен!');
                localStorage.removeItem('selectedProducts'); // Очищаем корзину
                window.location.reload(); // Перезагружаем страницу
            } else {
                console.error('Ошибка при оформлении заказа:', result);
                alert(`Ошибка при оформлении заказа: ${result.message}`);
            }
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            alert('Произошла ошибка при отправке заказа. Попробуйте еще раз.');
        }
    });
});

