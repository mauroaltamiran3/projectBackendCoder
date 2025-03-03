async function removeFromCart(cartId, productId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        alert('Producto eliminado del carrito');
        location.reload();
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        alert('Hubo un error al eliminar el producto del carrito');
    }
}

async function clearCart(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        alert('Carrito vaciado');
        location.reload();
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        alert('Hubo un error al vaciar el carrito');
    }
}