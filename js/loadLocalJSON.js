let seccionProducto = document.getElementById('seccion_productos');

//creo un contenedor individual para cada producto
let contenedorProductos = document.createElement('div');

//agrego una clase/estilo CSS al contenedor de los productos
contenedorProductos.classList.add('contenedor-producto');

async function cargarJSON() {
  try {
    //a response le asigno lo que me devuelve la consulta a la API que pide todos los productos
    const response = await fetch('js/productos.json');
    //a data le asigno todos los productos en formato .json
    const data = await response.json();
    // Limpio el contenedor antes de agregar productos
    seccionProducto.innerHTML = '';
    //creo un contenedor individual para cada producto
    let contenedorProductos = document.createElement('div');
    //agrego una clase/estilo CSS al contenedor de los productos
    contenedorProductos.classList.add('contenedor-producto');
    data.forEach(producto => {
      let precio = producto.price;
      let nombre = producto.name.replace("'", "`");
      let objToPass = {
        price : precio
      }
      // Crear la tarjeta del producto
      let card = document.createElement('div');
      card.classList.add('card');
      // Imagen
      let img = document.createElement('img');
      img.id = 'imagen';
      img.className = 'imagen';
      img.src = producto.image;
      img.alt = producto.name;
      card.appendChild(img);
      // Precio
      let divPrecio = document.createElement('div');
      divPrecio.id = 'precio';
      divPrecio.setAttribute('name', 'precio');
      divPrecio.textContent = producto.price + ' $';
      card.appendChild(divPrecio);
      card.appendChild(document.createElement('br'));
      // Nombre
      let divNombre = document.createElement('div');
      divNombre.id = 'nombre';
      divNombre.setAttribute('name', 'nombre');
      divNombre.className = 'nombre';
      divNombre.textContent = producto.name;
      card.appendChild(divNombre);
      card.appendChild(document.createElement('br'));
      // Descripción
      let divDesc = document.createElement('div');
      divDesc.id = 'desc';
      divDesc.setAttribute('name', 'desc');
      divDesc.className = 'desc';
      divDesc.textContent = producto.description;
      card.appendChild(divDesc);
      // Botón
      let boton = document.createElement('button');
      boton.className = 'button';
      boton.textContent = 'Agregar 🛒';
      boton.addEventListener('click', () => {
        addWishList(producto);
      });
      card.appendChild(boton);
      contenedorProductos.appendChild(card);
    });
    // Agrego el contenedor de productos a la sección principal
    seccionProducto.appendChild(contenedorProductos);
  } catch (error) {
    seccionProducto.innerHTML = '<p class="error">No se pudieron cargar los productos.</p>';
    console.error("Error al obtener productos:", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarJSON();
  mostrarWishList();
});

function addWishList(producto) {
  try {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    // Buscar si el producto ya está en la wishlist
    const index = wishlist.findIndex(item => item.id === producto.id);
    if (index !== -1) {
      // Si existe, aumenta la cantidad
      wishlist[index].cantidad = (wishlist[index].cantidad || 1) + 1;
    } else {
      // Si no existe, lo agrega con cantidad 1
      let productoCopia = { ...producto, cantidad: 1 };
      wishlist.push(productoCopia);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    mostrarWishList(); // Actualiza el HTML de la wishlist
  } catch (error) {
    console.error("Error al procesar producto : ", error);
  }
}

function mostrarWishList() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  let lista = document.getElementById('wishlist-list');
  if (!lista) {
    // Si no existe el contenedor, lo creo
    const wishlistSection = document.createElement('section');
    wishlistSection.id = 'wishlist';
    const titulo = document.createElement('h2');
    titulo.textContent = 'Lista de deseos';
    lista = document.createElement('ul');
    lista.id = 'wishlist-list';
    wishlistSection.appendChild(titulo);
    wishlistSection.appendChild(lista);
    // Lo agrego al final del body
    document.body.appendChild(wishlistSection);
  } else {
    lista.innerHTML = '';
  }
  wishlist.forEach(producto => {
    const li = document.createElement('li');
    li.textContent = `${producto.name} - Cantidad: ${producto.cantidad}`;
    lista.appendChild(li);
  });
}
