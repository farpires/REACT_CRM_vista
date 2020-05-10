import React,{Fragment, useState,useEffect} from 'react';
import clienteAxios from '../../config/axios'; 
import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProducto';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';

const NuevoPedido = (props) => {

    //extraer el Id de cliente
    const{id} = props.match.params;
    //state
    const [cliente , guardarCliente]= useState({});
    const [busqueda, guardarBusqueda] = useState('');
    const [productos, guardarProductos] = useState([]);
    const [total,guardarTotal] = useState(0);

    useEffect(()=>{
        //obtener el cliente 
        const consultarAPI = async ()=>{
            //consultar el cliente actual 
            const resultado = await clienteAxios.get(`/clientes/${id}`)
            guardarCliente(resultado.data);
        }
        //llamar api
        consultarAPI();
       
        actualizarTotal();

         // eslint-disable-next-line 
    },[productos]);

    /*Funciones important de busqueda ------------------------------------------*/
    const buscarProducto = async (e)=>{
        e.preventDefault();

        //obtener los productos de la busqueda 
        const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);
        
        //si no hay resultado una alerta, contarrio agregarlo al statet
        if (resultadoBusqueda.data[0]) {

            let productoResultado =  resultadoBusqueda.data[0];

            //Agregar la llave "producto" (copia de id)
            productoResultado.producto = resultadoBusqueda.data[0]._id;
            productoResultado.cantidad = 0;  
            
            //ponerlo en state 
            guardarProductos([...productos,productoResultado])
            // console.log(productoResultado);
        }else{
            Swal.fire({
                type:'error',
                title:'No Resultados',
                text:'No hay resultado',
            })
            //no hay resultado
        }
    }
    //alamcena busqueda en el state
    const leerDatosBusqueda = (e) =>{
        guardarBusqueda(e.target.value);
    }
    

    //actualizar la cantidad de producto
        const restarProductos = (i)=>{
            //copiar el areglo para no mutar original
            const todosProductos = [...productos];

            //validar si esta en cero no puede ir mas alla
            if (todosProductos[i].cantidad === 0)return;

            //decremento 
            todosProductos[i].cantidad--;

            //almacenarlo en el state
            guardarProductos(todosProductos);

        }
        const aumentarProductos = (i)=>{
            //copiar el areglo para no mutuar original
            const todosProductos = [...productos];
            //incremento
            todosProductos[i].cantidad++;
            //almacenar en el staete
            guardarProductos(todosProductos);
        }

        //elimina un producto del state ------------------------------------------------------------ELIMINAR 
        const eliminarProductoPedido = id =>{
            const todosProductos = productos.filter(producto => producto.producto !== id);
            guardarProductos(todosProductos);
        }

        //actualizar el total a pagar 
        const actualizarTotal = ()=>{
            //si ela rreglo de producto es igual a 0: el total es 0
            if(productos.length === 0){
                guardarTotal(0);
                return;
            }
            
            //calcular el nuevo total
            let nuevoTotal = 0; 
            
            //recorrer todos los productos, y sus cantidades  y precio 
            productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));
            
            //almacenar el total 
            guardarTotal(nuevoTotal);

        }

    // Almacena el pedido en la BD
    const realizarPedido = async e => {
        e.preventDefault();

        // extraer el ID
        const { id } = props.match.params;

        // construir el objeto
        const pedido = {
            "cliente" : id, 
            "pedido" : productos, 
            "total" : total
        }

        // almacenarlo en la BD
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${id}`, pedido);

        // leer resultado
        if(resultado.status === 200) {
            // alerta de todo bien
            Swal.fire({
                type: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
            })
        } else {
            // alerta de error
            Swal.fire({
                type: 'error',
                title: 'Hubo un Error',
                text: 'Vuelva a intentarlo'
            })
        }

        // redireccionar
        props.history.push('/pedidos');

    }


    return (
            <Fragment>
            
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
                <p>Telefono: {cliente.telefono}</p>
            </div>
                <FormBuscarProducto
                buscarProducto = {buscarProducto}
                leerDatosBusqueda = {leerDatosBusqueda}
                />
                <ul className="resumen">
                
                {productos.map((producto, index)=>(
                    <FormCantidadProducto
                        key={producto.producto}
                        producto={producto}
                        restarProductos={restarProductos}
                        aumentarProductos={aumentarProductos}
                        eliminarProductoPedido={eliminarProductoPedido}
                        index={index}

                    />
                ))}
                
                </ul>
                <p className="total">Total a Pagar: <span>${total}</span> </p>

                {   total > 0 ? (
                        <form
                        onSubmit={realizarPedido}
                        >
                            <input type="submit"
                            className="btn btn-verde btn-block"
                            value="Realizar Pedido"/>
                        </form>
                    ):null }
            </Fragment> 
    );
}

export default withRouter(NuevoPedido);