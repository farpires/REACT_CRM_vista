import React from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';

const DetallesPedidos = ({pedido}) => {

    const {cliente, _id}=pedido; 
    // console.log(pedido)


    const eliminarCliente = idCliente =>{
        Swal.fire({
            title: 'Estas seguro?',
            text: "un Pedido elimindao no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'si, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
              //llamado axios
            clienteAxios.delete(`/pedidos/${idCliente}`)
                            .then(res=>{
                                Swal.fire(
                                    'Eliminado!',
                                    res.data.mensaje,
                                    'success'
                                )
                            });

            }
        })
    }



    return ( 
            <li className="pedido">
            <div className="info-pedido">
                <p className="id">ID: 0192019201291201</p>
                <p className="nombre">Cliente: {cliente.nombre} {cliente.apellido}</p>

                <div className="articulos-pedido">
                    <p className="productos">Artículos Pedido: </p>
                    <ul>
                       {pedido.pedido.map(articulos => (
                        <li key={pedido._id+articulos.producto._id}>
                            <p>{articulos.producto.nombre}</p>
                            <p>Precio: {articulos.producto.precio}</p>
                            <p>Cantidad:{articulos.cantidad}</p>
                        </li>
                       ))}
                     
                    </ul>
                </div>
                <p className="total">Total: ${pedido.total}</p>
            </div>
            <div className="acciones">
       

                <button 
                type="button" 
                className="btn btn-rojo btn-eliminar"
                onClick={() => eliminarCliente(_id)}
                >
                    <i className="fas fa-times"></i>
                    Eliminar Pedido
                </button>
            </div>
        </li>

     );
}
 
export default DetallesPedidos;