document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded event triggered');
    const ordersContainer = document.querySelector('#orders-container');

    if (!ordersContainer) {
        console.error('Orders container not found');
        return;
    }

    try {
        console.log('Fetching orders from server...');
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19');
        const orders = await response.json();
        console.log('Orders fetched:', orders);

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p class="no-orders">Нет заказов для отображения. Перейти к <a href="order.html">оформлению заказа</a></p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'orders-table';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>№</th>
                <th>Дата и время оформления</th>
                <th>Состав</th>
                <th>Итоговая стоимость</th>
                <th>Дата доставки</th>
                <th>Временной интервал</th>
                <th>Действия</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        for (const [index, order] of orders.entries()) {
            console.log(`Processing order ${index + 1}:`, order);
            const tr = document.createElement('tr');

            const orderDate = new Date(order.created_at).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // получаем информацию о товарах по их идентификаторам
            const goodsPromises = order.good_ids.map(id =>
                fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods/${id}?api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19`)
                    .then(response => response.json())
            );
            const goods = await Promise.all(goodsPromises);
            console.log(`Goods for order ${index + 1}:`, goods);
            const goodsNamesLimited = goods.map(good => good.name.split(' ').slice(0, 3).join(' ')).join(', ');
            const totalPrice = goods.reduce((sum, good) => sum + good.actual_price, 0);

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${orderDate}</td>
                <td>${goodsNamesLimited}</td>
                <td>${totalPrice}\u20BD</td>
                <td>${order.delivery_date}</td>
                <td>${order.delivery_interval}</td>
                <td>
                    <button class="view-order" data-id="${order.id}"></button>
                    <button class="edit-order" data-id="${order.id}"></button>
                    <button class="delete-order" data-id="${order.id}"></button>
                </td>
            `;

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        ordersContainer.appendChild(table);
        console.log('Table appended to ordersContainer');

        // просмотр
        document.querySelectorAll('.view-order').forEach(button => {
            button.addEventListener('click', async (event) => {
                const orderId = event.target.getAttribute('data-id');
                const modal = document.getElementById('modal');
                const modalDetails = document.getElementById('modal-details');

                try {
                    const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19`);
                    const orderDetails = await response.json();

                    const goodsPromises = orderDetails.good_ids.map(id =>
                        fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods/${id}?api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19`)
                            .then(response => response.json())
                    );
                    const goods = await Promise.all(goodsPromises);
                    const goodsNames = goods.map(good => good.name).join(', ');
                    const totalPrice = goods.reduce((sum, good) => sum + good.actual_price, 0);

                    modalDetails.innerHTML = `
                        <h2>Просмотр заказа</h2>
                        <p>Имя: ${orderDetails.full_name}</p>
                        <p>Адрес доставки: ${orderDetails.delivery_address}</p>
                        <p>Телефон: ${orderDetails.phone}</p>
                        <p>Дата доставки: ${orderDetails.delivery_date}</p>
                        <p>Временной интервал: ${orderDetails.delivery_interval}</p>
                        <p>Комментарий: ${orderDetails.comment}</p>
                        <p>Товары: ${goodsNames}</p>
                        <p>Итоговая стоимость: ${totalPrice}\u20BD</p>
                    `;

                    modal.style.display = 'block';
                } catch (error) {
                    console.error('Ошибка при получении деталей заказа:', error);
                }
            });
        });

        // редактирование
        document.querySelectorAll('.edit-order').forEach(button => {
            button.addEventListener('click', (event) => {
                const modal = document.getElementById('modal');
                const modalDetails = document.getElementById('modal-details');

                modalDetails.innerHTML = `
                    <h2>Редактирование заказа</h2>
                    <p>Упс... Редактирование пока в разработке :(</p>
                `;

                modal.style.display = 'block';
            });
        });

        // удаление
        document.querySelectorAll('.delete-order').forEach(button => {
            button.addEventListener('click', (event) => {
                const orderId = event.target.getAttribute('data-id');
                const modal = document.getElementById('modal');
                const modalDetails = document.getElementById('modal-details');

                modalDetails.innerHTML = `
                    <h2>Удаление заказа</h2>
                    <p class="question-delete">Вы уверены что хотите удалить заказ?</p>
                    <div class="confirm-delete">
                        <button id="confirm-delete">Да</button>
                        <button id="cancel-delete">Нет</button>
                    </div>
                `;

                modal.style.display = 'block';

                document.getElementById('cancel-delete').addEventListener('click', () => {
                    modal.style.display = 'none';
                });

                document.getElementById('confirm-delete').addEventListener('click', async () => {
                    try {
                        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            alert('Заказ успешно удален!');
                            modal.style.display = 'none';
                            window.location.reload();
                        } else {
                            alert('Ошибка при удалении заказа.');
                        }
                    } catch (error) {
                        console.error('Ошибка при удалении заказа:', error);
                        alert('Произошла ошибка при удалении заказа. Попробуйте еще раз.');
                    }
                });
            });
        });


        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('modal').style.display = 'none';
        });

        // закрытие модального окна при клике вне его
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('modal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        ordersContainer.innerHTML = '<p>Произошла ошибка при загрузке заказов. Попробуйте еще раз позже.</p>';
    }
});
