import React,{useState, Fragment, useContext} from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { withRouter } from 'react-router-dom';
//import context
import {CRMContext} from '../../context/CRMContext';

const NuevoProducto = (props) => {

      
    //utilizar valores de context
    const [auth,guardarAuth] = useContext(CRMContext)   

    //producto = state, guardarProducto = setState
    const [producto, guardarProducto] = useState({
        nombre:'',
        precio:''
    });

    //archivo = state, guardarArchivo = setState
    const [archivo, guardarArchivo] = useState('');

    //almacena el nuevo producto en la base de datos.
    const handleProducto = async (e) =>{
        e.preventDefault();

        //crear un formdata 
        const formData =  new FormData();
        formData.append('nombre',producto.nombre);
        formData.append('precio',producto.precio);
        formData.append('imagen',archivo);

        //almacenarlo en la base de datos 
        try {
            const res = await clienteAxios.post('/productos',formData,{
                headers:{
                    'Content-Type' : 'multipart/form-data'
                }   
            });
            console.log(res);
            //lanzar una alerta
            if (res.status === 200) {
                Swal.fire(
                    'Agregar Correctamente',
                    res.data.mensaje,
                    'success',
                )
            }
            //redireccionar
            props.history.push('/productos');
        } catch (error) {
            console.log(error);
            // lanzar alerta
            Swal.fire({
                type:'error',
                title:'Hubo un errror',
                text: 'Vuelva intentarlo'
            })
        }

    }

    //leer los datos del fomrulario 
    const handleChange = e =>{
        guardarProducto({
            //obtener una copia del state y agrgar uno nuevo
            ...producto,
            [e.target.name] : e.target.value 
        })
        console.log(producto)
    }
    //Coloca la imagen en el state
    const handleChangeImagen = e =>{
            guardarArchivo(e.target.files[0]);
    }

      //verificar si el usuario esta autenticado o no
      if(!auth.auth && (localStorage.getItem('token') === auth.token)){
        props.history.push('./iniciar-sesion');
    }

    return ( 
                <Fragment>
                    <h2>Nuevo Producto</h2>

                    <form 
                    onSubmit={handleProducto}
                    >
                        <legend>Llena todos los campos</legend>

                        <div className="campo">
                            <label>Nombre:</label>
                            <input 
                                type="text" 
                                placeholder="Nombre Producto" 
                                name="nombre"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="campo">
                            <label>Precio:</label>
                            <input 
                                type="number" 
                                name="precio" 
                                min="0.00" 
                                step="0.01" 
                                placeholder="Precio" 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="campo">
                            <label>Imagen:</label>
                            <input 
                                type="file"  
                                name="imagen"
                                onChange={handleChangeImagen} 
                            />
                        </div>

                        <div className="enviar">
                                <input 
                                    type="submit" 
                                    className="btn btn-azul" 
                                    value="Agregar Producto"
                                />
                        </div>
                    </form>

                </Fragment>

     );
}
 
export default withRouter(NuevoProducto);