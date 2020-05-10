import React,{useEffect,useState,Fragment} from 'react';
import clienteAxios from '../../config/axios';
import DetallesPedidos from './DetallesPedidos';

const Pedidos = () => {

    const [pedidos,guaradrPedidos]=useState([]);

    useEffect(()=>{
        const consultarAPI = async () =>{
            //obtener los pedidos 
            const resultado = await clienteAxios.get('/pedidos');
            guaradrPedidos(resultado.data);
        }
        consultarAPI();
    },[])//pedidos

    return ( 
            
        <Fragment>
                <h2>Pedidos</h2>

                <ul className="listado-pedidos">
                {
                    pedidos.map(pedido =>(
                        <DetallesPedidos
                        key={pedido._id}
                        pedido={pedido}
                        />
                    ))
                }
                
                </ul>
        </Fragment>
    );
}

export default Pedidos;