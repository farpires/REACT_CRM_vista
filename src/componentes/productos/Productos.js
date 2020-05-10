import React,{useEffect,useState,useContext, Fragment} from 'react';
import {Link} from 'react-router-dom';
import clienteAxios from '../../config/axios'
import Producto from './Producto';
import Spinner from '../layout/Spinner';
//importamos el context
import {CRMContext} from '../../context/CRMContext';

const Productos = (props) => {
    //productos=state , guardarProductps= funcion para guardar state 
    const [productos, guardarProductos]= useState([]);

    //utilizar valores de context
    const [auth,guardarAuth] = useContext(CRMContext)

        


    //useEfecct para consultar api cuando carge 
    useEffect(()=>{
        if(auth.token != ''){
         // query a la api
        const consultarAPI = async()=>{
            try {
            const productosConsulta = await clienteAxios.get('/productos',{
                headers:{
                    Authorization : `Bearer ${auth.token}`
                }   
            });
            guardarProductos(productosConsulta.data);
            } catch (error) {
                 //errore  con autorizacion
                if(error.response.status = 500){
                    props.history.push('/iniciar-sesion')
                }
            }
        }

        //llamar a la api consultar api
            consultarAPI();
        }else{
            props.history.push('/iniciar-sesion')
        }

    },[]);//productos

//si es state esta como false
if(!auth.auth){
    props.history.push('./iniciar-sesion')
}


    //spinner de carga 
    if(!productos.length) return <Spinner/>


    return ( 
        <Fragment>
            <h2>Porductos</h2>
            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-producto">
            <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
                {productos.map(producto =>(
                        <Producto
                            key={producto._id}
                            producto={producto}
                        />
                ))}
                
            </ul>
        </Fragment>
    );
}

export default Productos;