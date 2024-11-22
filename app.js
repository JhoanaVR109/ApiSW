document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar categorías
    fetch('https://<tu_url_vercel>/api/categorias')
        .then(response => response.json())
        .then(data => {
            const categoriasList = document.getElementById('lista-categorias');
            data.forEach(categoria => {
                const li = document.createElement('li');
                li.textContent = categoria.nombre;
                li.onclick = () => cargarProductos(categoria.idCategoria);
                categoriasList.appendChild(li);
            });
        });

    // Función para cargar productos de la categoría seleccionada
    function cargarProductos(idCategoria) {
        fetch(`https://<tu_url_vercel>/api/productos/${idCategoria}`)
            .then(response => response.json())
            .then(data => {
                const productosList = document.getElementById('lista-productos');
                productosList.innerHTML = '';  // Limpiar productos previos
                data.forEach(producto => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <p><strong>$${producto.precio}</strong></p>
                    `;
                    productosList.appendChild(li);
                });
            });
    }
});