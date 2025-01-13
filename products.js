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
