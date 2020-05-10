import React,{Fragment, useContext} from 'react';
/*routing */
/*Switch =  rutas de navegacion */
/*Route= ruta en si */
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

/* Layout */
import Header from './componentes/layout/Header';
import Navegacion from './componentes/layout/Navegacion';


/*Componnentes */
import Clientes from './componentes/clientes/Clientes';
import NuevoCliente from './componentes/clientes/NuevoCliente';
import EditarCliente from './componentes/clientes/EditarCliente';

import Productos from './componentes/productos/Productos';
import EditarProducto from './componentes/productos/EditarProducto';
import NuevoProducto from './componentes/productos/NuevoProducto';



import Pedidos from './componentes/pedidos/Pedidos';
import NuevoPedido from './componentes/pedidos/NuevoPedido';

import Login from './componentes/auth/Login';

import {CRMContext, CRMProvider} from './context/CRMContext';

function App(){
  //utiliza context n eel componentes
  const [auth, guardarAuth] = useContext(CRMContext)
  console.log(process.env.REACT_APP_BACKEND_URL)
  return ( 
    <Router>
    <Fragment>
      <CRMProvider value={[auth, guardarAuth]}>
        <Header />
        <div className="grid contenedor contenido-principal"> 
        <Navegacion />      
        <main className="caja-contenido col-9">
          {/* //TODO LOS ROUTING: A DIFERENTES COMPONENTES  */}
          <Switch>
            <Route exact path="/" component={Clientes}/>

            <Route exact path="/clientes/nuevo" component={NuevoCliente}/>

            <Route exact path="/clientes/editar/:id" component={EditarCliente}/>

            <Route exact path="/productos" component={Productos}/>

            <Route exact path="/productos/nuevo" component={NuevoProducto}/>

            <Route exact path="/productos/editar/:id" component={EditarProducto}/>

            <Route exact path="/pedidos" component={Pedidos}/>

            <Route exact path="/pedidos/nuevo/:id" component={NuevoPedido}/>
            
            <Route exact path="/iniciar-sesion" component={Login}/>

          </Switch>
        </main>
            <Switch>

            </Switch>
        </div>
      </CRMProvider>
      </Fragment>
      </Router>
    )
}

export default App;
