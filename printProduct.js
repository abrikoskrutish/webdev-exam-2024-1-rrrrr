function printProduct() {

    
        const catalog = document.querySelector('.self-catalog');
    
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card';
    
            const img = document.createElement('img');
            img.className = 'img-card';
            img.src = product.image_url;
            img.alt = product.name;
    
            const name = document.createElement('p');
            name.className = 'name-product'
            name.textContent = product.name;
    
            const rating = document.createElement('p');
            rating.textContent = product.rating;
    
            const price = document.createElement('p');
            price.textContent = `${product.actual_price}\u20BD`;
    
            const button = document.createElement('button');
            button.textContent = 'Добавить';
    
            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(rating);
            card.appendChild(price);
            card.appendChild(button);
    
            catalog.appendChild(card);
        });

}
