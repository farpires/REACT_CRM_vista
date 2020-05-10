import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import clienteAxios from '../../config/axios';
//context
import {CRMContext} from '../../context/CRMContext'


const Login = (props) => {

    //Auth y token
    const [auth,guardarAuth]= useContext(CRMContext);
    console.log(auth);

    //state con los datos del formulario 
    const [credenciales, guardarcredenciales] =  useState({});

    //inicia sesion en el servidor
    const handleSubmit = async e => {
        e.preventDefault();
        //autenticar usuario
        try {
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);

            //extraer el token y colocarlo en localhestorage 
            const { token } = respuesta.data;
            localStorage.setItem('token',token);

            //colocar en el state
            guardarAuth({
                token,
                auth:true,
            })

            //alerta
            Swal.fire(
                'login correcto',
                'Has iniciado Sesion',
                'success',
            )

            // redireccionar
                props.history.push('/');
        } catch (error) {
            // console.log(error)
            if(error.response){
                Swal.fire({
                    type:'error',
                    title:'Hubo un error ',
                    text: error.response.data.mensaje
                })
            }else{
                Swal.fire({
                    type:'error',
                    title:'Hubo un error ',
                    text: 'Hubo un error'
                })
            }
        }
    } 


    //almacena lo que el usuario escribe en el state
    const handleChange = (e)=>{
        guardarcredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        })
    }
    
    return ( 
        <div className="login">
            <h2>Iniciar Sesion</h2>
            <div className="contenedor-formulario">
                <form
                onSubmit={handleSubmit}
                >

                    <div className="campo">
                        <label>Email</label>
                        <input 
                            type="text"
                            name="email"//para mapearlo con el state
                            placeholder="Email para Iniciar Sesion"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className="campo">
                        <label>Password</label>
                        <input 
                            type="password"
                            name="password"//para mapearlo con el state
                            placeholder="Password para Iniciar Sesion"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <input 
                    type="submit"
                    value="iniciar Sesion"
                    className="btn btn-verde btn-block"
                    />
                </form>
            </div>
        </div>
     );
}
 
export default withRouter(Login);   