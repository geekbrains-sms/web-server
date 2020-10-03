import React, { useContext } from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from './routes';
import 'materialize-css';
import 'bootstrap'
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Loader } from './components/Loader';


function App() {
	const {token, login, logout, ready} = useAuth()
	const isAuthenticated = !!token
	const routes = useRoutes(isAuthenticated);
	const auth = useContext(AuthContext)
	const showAuthForm = auth.showAuthForm
	if (!ready){
		return <Loader/>
	}
    return (
		<AuthContext.Provider value={{
			token, login, logout, isAuthenticated, showAuthForm
		}}>
			<Router>
				<div className="container">
					<Navbar/>
					{routes}
				</div>
			</Router>
		</AuthContext.Provider>
      
    )
}

export default App;
