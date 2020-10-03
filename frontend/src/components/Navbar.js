import React, { useContext, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {NavLink, useHistory} from 'react-router-dom'
import { useMessage } from '../hooks/message.hook'

export const Navbar = () => {
	const history = useHistory()
	const auth = useContext(AuthContext)
    const { request, error, clearError} = useHttp()
    const [form, setForm] = useState({
        username: '',
        password: ''
	})
	const [visible, setVisible] = useState(false)
	auth.showAuthForm = setVisible
	const loginHandler = async () => {
		try {
			const data = await request('/api/v1/auth', 'POST', {...form})
			auth.login(data.token)
			closeForm()
		} catch (error) {}
	}
	const logoutHandler = event => {
		event.preventDefault()
		auth.logout()
		history.push('/')
	}
    const changeHandler = event => {
		setForm({...form, [event.target.name]: event.target.value })
	}
	const message = useMessage()
	useEffect(()=>{ 
		window.M.updateTextFields()
	})
	useEffect(()=>{
		message(error)
		clearError()
	},[error, message, clearError])
	const closeForm = () => {
		setVisible(false)
	}

	const dialogHandler = () =>{
		setVisible(true);
		
	}
	const keypressHandler = event => {
		if (event.key === 'Enter' ){
			loginHandler()
		}
	}

	return (
		<div className="row header">
			<nav>
				<div className="nav-wrapper">
					<span className="brand-logo">Склад</span>
					{ auth.isAuthenticated && <ul className="col xl4 offset-xl5">
						<li><NavLink to="/products">Товары</NavLink></li>
						<li><NavLink strict to="/catalogs">Справочники</NavLink></li>
					</ul> }
					<ul id="nav-mobile" className="right hide-on-med-and-down">
						<li>{
							auth.isAuthenticated 
							? <button className='button-in-out' onClick={ logoutHandler }>Выход</button> 
							: <button className='button-in-out' onClick={ dialogHandler }>Вход</button>
						}</li>
					</ul>
				</div>
			</nav>			
			{ visible && <div id="auth-form">
				<div className = "card blue-grey darken-1" id="auth-card">
					<div className="material-icons white right" id="close" onClick={ closeForm }>close</div>
					<div className = "card-content white-text" >
						<span className = "card-title" > Авторизация </span> 
						<div>
							<div className = "input-field">
								<input 
									id = "username"
									type = "text"
									name = "username"
									className = "yellow-input"
									onChange =  { changeHandler }
									value = { form.username }
								/> 
								<label htmlFor = "username" > Введите логин </label> 
							</div> 
							<div className = "input-field" >
								<input 
									id = "password"
									type = "password"
									name = "password"
									className = "yellow-input"
									onChange = { changeHandler }
									onKeyPress = { keypressHandler }
									value = { form.password }
								/> 
								<label htmlFor = "password" > Введите пароль </label> 
							</div>
						</div> 
					</div> 
					<div className = "card-action" >
						<button 
							className = "btn login"
							style = {{ marginRight: 10 }}
							onClick = { loginHandler }
							>Войти
						</button> 
						<button 
							className = "btn register"
							// onClick = { registerHandler }
							// disabled = { loading }
						>Регистрация 
						</button> 
					</div>
				</div> 
			</div> }
		</div>
		
	)
}