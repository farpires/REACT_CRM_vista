import React,{Fragment, useState, useContext} from 'react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
//import context
import {CRMContext} from '../../context/CRMContext';




const NuevoCliente = ({history}) => {

    
    //utilizar valores de context
    const [auth,guardarAuth] = useContext(CRMContext)   


    //cliente =state, guardarCliente = funcion para guardar el state
    const[cliente,guardarCliente] = useState({
        nombre:'',
        apellido:'',
        empresa: '',
        email: '',
        telefono: '',
    });

    //leer los datos del formulario 
    const handleChange = e =>{
        //almacenar lo  que usuario escribe en ele state
        guardarCliente({
            //obtener una copia del STAT ACTUAL
            ...cliente,
            [e.target.name]: e.target.value,
        })
    }
    //anade en la REST API un Cliente nuevo 
    const handleSubmit = (e)=>{
        e.preventDefault();

        //enviar peticiones
        clienteAxios.post('/clientes',cliente)
                    .then(res =>{
                        //validad si hay errores de mongo 
                        if(res.data.code === 11000){
                            console.log('Error de Duplicado de Mongo')
                            Swal.fire({
                                icon: 'error',
                                title: 'Hubo un error',
                                text: 'Ese Cliente ya esta registrado',
                            })
                        }else{
                            Swal.fire(
                                'Se agrego el Cliente',
                                res.data.mensaje,
                                'success'
                            )
                        }
                        //redireccionar
                        history.push('/');
                    });
    }



    //validar cliente
        const validarCliente = ()=>{
            //Destructuring
            const { nombre, apellido, email, empresa , telefono}= cliente;

            //revisar que las propiedades del state tengan contenido
            let valido = !nombre.length ||  !apellido.length || !empresa.length || !email.length || !telefono.length;

            //return true, o false 
            return valido;
        }

        //verificar si el usuario esta autenticado o no
        if(!auth.auth && (localStorage.getItem('token') === auth.token)){
            history.push('./iniciar-sesion');
        }
    
    
    return ( 
        <Fragment>
        <h2>Nuevo Cliente</h2>
        <form
        onSubmit={handleSubmit}
        >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input  type="text" 
                            placeholder="Nombre Cliente" 
                            name="nombre"
                            onChange={handleChange}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input  type="text" 
                            placeholder="Apellido Cliente" 
                            name="apellido"
                            onChange={handleChange}
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input  type="text" 
                            placeholder="Empresa Cliente" 
                            name="empresa"
                            onChange={handleChange}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input  type="email" 
                            placeholder="Email Cliente" 
                            name="email"
                            onChange={handleChange}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input  type="tel" 
                            placeholder="Teléfono Cliente" 
                            name="telefono"
                            onChange={handleChange}
                    />
                </div>

                <div className="enviar">
                        <input  type="submit" 
                                className="btn btn-azul" 
                                value="Agregar Cliente"
                                disabled={ validarCliente() }
                        />
                </div>

            </form>
        </Fragment>
     );
}
//HOC, es una funcion que toma un componente y retorna un nuevo componente 
export default withRouter(NuevoCliente);