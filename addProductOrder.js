document.addEventListener('DOMContentLoaded', async () => {
    const catalog = document.querySelector('.self-catalog');
    const endCostDiv = document.querySelector('.div-end-cost');
    let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
    let totalCost = 0;

    if (selectedProducts.length === 0) {
        catalog.innerHTML = '<p class="no-orders">Корзина пуста. Перейдите в <a href="index.html">каталог</a>, чтобы добавить товары.</p>';
        endCostDiv.textContent = 'Итоговая стоимость: 0\u20BD';
    } else {
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

                totalCost += product.actual_price;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-product';
                deleteButton.textContent = 'Удалить';
                deleteButton.addEventListener('click', () => {
                    selectedProducts = selectedProducts.filter(id => id !== product.id.toString());
                    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
                    card.remove();
                    totalCost -= product.actual_price;
                    endCostDiv.textContent = `Итоговая стоимость: ${totalCost}\u20BD`;
                    if (selectedProducts.length === 0) {
                        catalog.innerHTML = '<p class="no-orders">Корзина пуста. Перейдите в <a href="index.html">каталог</a>, чтобы добавить товары.</p>';
                        endCostDiv.textContent = 'Итоговая стоимость: 0\u20BD';
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

        endCostDiv.textContent = `Итоговая стоимость: ${totalCost}\u20BD`;
    }


    const form = document.querySelector('form');



    form.addEventListener('submit', async (event) => {
        event.preventDefault();


        if (selectedProducts.length === 0) {
            const notificator = document.querySelector('.notification');
            const notificatorText = document.querySelector('.notification p');
            
            notificator.style.display = 'block';
            notificator.style.backgroundColor = 'rgb(148, 238, 250)';
            notificator.style.border = '1px solid rgb(52, 103, 157)';
            notificator.style.position = 'sticky';
            notificatorText.textContent = 'Корзина пуста. Добавьте товары!';
            setTimeout(() => {
                notificator.style.display = 'none';
            }, 5000);
            return;
        }

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
            delivery_date: deliveryDate, 
            email: formData.get('email'),
            delivery_interval: formData.get('delivery_interval'),
            comment: formData.get('comment'),
            good_ids: selectedProducts.map(id => parseInt(id)), 
            subscribe: formData.get('mailing') === 'yes' ? 1 : 0, 
            total_cost: totalCost 
        };


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
                const notificator = document.querySelector('.notification');
                const notificatorText = document.querySelector('.notification p');
                
                notificator.style.display = 'block';
                notificator.style.backgroundColor = 'rgb(121, 234, 115)';
                notificator.style.border = '1px solid rgb(79, 155, 75)';
                notificator.style.position = 'sticky';
                notificatorText.textContent = 'Заказ успешно оформлен!';
                setTimeout(() => {
                    notificator.style.display = 'none';
                }, 5000);
                localStorage.removeItem('selectedProducts');
                window.location.reload();
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