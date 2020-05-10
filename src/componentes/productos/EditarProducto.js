import React, {useState,useEffect,Fragment} from 'react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import Spinner from '../layout/Spinner';

const EditarProducto = (props) => {

    //1paso obtener el id del producto 
    const { id } = props.match.params;

    //producto = state funcion para actualizar 
    const [producto, guardarProducto]= useState({
        nombre:'',
        precio: '',
        imagen: ''
    })

        //archivo = state, guardarArchivo = setState
        const [archivo, guardarArchivo] = useState(''); 
  
    //Cuando el componente carga 
    useEffect(()=>{
        //consultar a la api para traer el producto a editar 
        const consultarAPI= async ()=>{
        const productoConsulta = await clienteAxios.get(`/productos/${id}`);
        guardarProducto(productoConsulta.data);
    }
        consultarAPI();
        // eslint-disable-next-line 
    },[])

    //Edita un producto en la base de dato 
    const handleSubmit = async e =>{
        e.preventDefault();

        //crear un formdata 
        const formData =  new FormData();
        formData.append('nombre',producto.nombre);
        formData.append('precio',producto.precio);
        formData.append('imagen',archivo);

        //almacenarlo en la base de datos 
        try {
            const res = await clienteAxios.put(`/productos/${id}`,formData,{
                headers:{
                    'Content-Type' : 'multipart/form-data'
                }   
            });
            console.log(res);
            //lanzar una alerta
            if (res.status === 200) {
                Swal.fire(
                    'Editado Correctamente',
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
    //extraer los valores del state
    const { nombre, precio,imagen} = producto;

    if(!nombre.length) return <Spinner/>

    return ( 
        <Fragment>
        <h2>Editar Producto</h2>

        <form 
        onSubmit={handleSubmit}
        >
            <legend>Llena todos los campos</legend>

            <div className="campo">
                <label>Nombre:</label>
                <input 
                    type="text" 
                    placeholder="Nombre Producto" 
                    name="nombre"
                    onChange={handleChange}
                    defaultValue={nombre}
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
                    defaultValue={precio}
                />
            </div>

            <div className="campo">
                <label>Imagen:</label>
                { imagen ? (<img src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`} alt="imagen" width="300"/>) : null}
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
                        value="Editar Producto"
                    />
            </div>
        </form>

    </Fragment>
     );
}
 
export default withRouter(EditarProducto);