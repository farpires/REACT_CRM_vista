import React,{useEffect, useState, Fragment, useContext} from 'react';
//importar cliente axios                 contiene todos los metodo para consukta la api
import clienteAxios from '../../config/axios'
import Cliente from './Cliente'
import {Link, withRouter} from 'react-router-dom';
import Spinner from '../layout/Spinner';
//importamos el context
import {CRMContext} from '../../context/CRMContext';

const Clientes = (props) => {
    //trabajar en el state
    const [clientes, guardarCleintes]= useState([]);

    //utilizar valores de context
    const [auth,guardarAuth] = useContext(CRMContext)
    // console.log(auth);
     //use effect es similar a componentdidmount y willmout
    //se encarga de hacer un RENDEE 
    useEffect(()=>{

        if(auth.token != ''){
            //query a la API                1-paso hacerla Asinc 2-paso variable a donde va depositado los datos 
        const consultarAPI = async ()=>{
            try {
                const clienteConsulta = await clienteAxios.get('/clientes',{
                    headers:{
                        Authorization : `Bearer ${auth.token}`
                    }
                });
                guardarCleintes(clienteConsulta.data);
            } catch (error) {
                //errore  con autorizacion
                if(error.response.status = 500){
                    props.history.push('/iniciar-sesion')
                }
            }
        }
            consultarAPI();
        }else{
            props.history.push('/iniciar-sesion');
        }
    },[])//clientes
 
    //si es state esta como false
    if(!auth.auth){
        props.history.push('/iniciar-sesion')
    }
 
    //spinner de carga 
    if(!clientes.length) return <Spinner/>
    return ( 
        <Fragment>
            
        <h2>Clientes</h2>
        
        <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente"> 
                <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
        </Link>
        <ul className='listado-clientes'>
            {clientes.map(cliente =>(
            <Cliente 
                key={cliente._id}
                cliente={cliente}
            />
            ))}
        </ul>
        </Fragment>
    );
}

export default withRouter(Clientes);