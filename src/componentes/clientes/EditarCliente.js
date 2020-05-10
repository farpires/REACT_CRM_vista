import React,{Fragment, useState, useEffect} from 'react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios'

const EditarCliente = (props) => {
   //obtener ID
    const {id} = props.match.params
    // console.log(id)
    //cliente =state, guardarCliente = funcion para guardar el state
    const[cliente,datosClientes] = useState({
        nombre:'',
        apellido:'',
        empresa: '',
        email: '',
        telefono: '',
    });

    //Query a la api 
    const consultarAPI = async()=>{
        const clienteConsulta = await clienteAxios.get(`clientes/${id}`);
        datosClientes(clienteConsulta.data);
    }

    //useEffect , cuando el componnet carga
    useEffect(()=>{
        consultarAPI();
        //eslint-disable-next-line
    },[])

    //leer los datos del formulario 
    const handleChange = e =>{
        //Almacenar lo  que usuario escribe en ele state
        datosClientes({
            //obtener una copia del STAT ACTUAL
            ...cliente,
            [e.target.name]: e.target.value,
        })
    }
    
    //Envia una peticion por axios para actualizar el cliente 
    const handleSubmit = e =>{
        e.preventDefault();

        //enviar peticion por axios 
        clienteAxios.put(`/clientes/${cliente._id}`,cliente)
                        .then(res=>{
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
                                'Correcto',
                                'Se actualizo Correctamente',
                                'success'
                            )
                        }
                        //redire
                        props.history.push('/');
                    })
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
    
    
    return ( 
        <Fragment>
        <h2>Editar Cliente</h2>
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
                            value={cliente.nombre}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input  type="text" 
                            placeholder="Apellido Cliente" 
                            name="apellido"
                            onChange={handleChange}
                            value={cliente.apellido}
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input  type="text" 
                            placeholder="Empresa Cliente" 
                            name="empresa"
                            onChange={handleChange}
                            value={cliente.empresa}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input  type="email" 
                            placeholder="Email Cliente" 
                            name="email"
                            onChange={handleChange}
                            value={cliente.email}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input  type="tel" 
                            placeholder="Teléfono Cliente" 
                            name="telefono"
                            onChange={handleChange}
                            value={cliente.telefono}
                    />
                </div>

                <div className="enviar">
                        <input  type="submit" 
                                className="btn btn-azul" 
                                value="Guardar Cambios"
                                disabled={ validarCliente() }
                        />
                </div>

            </form>
        </Fragment>
     );
}
//HOC, es una funcion que toma un componente y retorna un nuevo componente 
export default withRouter(EditarCliente);