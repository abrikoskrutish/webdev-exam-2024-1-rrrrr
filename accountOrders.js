document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.querySelector('#orders-container');

    if (!ordersContainer) {
        return;
    }

    try {
        const response = await fetch('https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=12fe1881-5f53-4b3b-83a6-1fd9222bdb19');
        const orders = await response.json();

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>Нет заказов для отображения.</p>';
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
            const goodsNames = goods.map(good => good.name).join(', ');

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${orderDate}</td>
                <td>${goodsNames}</td>
                <td>${order.total_price}\u20BD</td>
                <td>${order.delivery_date}</td>
                <td>${order.delivery_interval}</td>
                <td>
                    <button class="view-order">Просмотр</button>
                    <button class="edit-order">Редактирование</button>
                    <button class="delete-order">Удаление</button>
                </td>
            `;

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        ordersContainer.appendChild(table);
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        ordersContainer.innerHTML = '<p>Произошла ошибка при загрузке заказов. Попробуйте еще раз позже.</p>';
    }
});