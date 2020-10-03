import React from 'react'
import { NavLink } from 'react-router-dom'

export const SideBar = () =>{
	return (
		<div className="col xl3 menu-sidebar">
			<ul className="collection">			
				<li className="collection-item" ><NavLink className="btn" to="/products/posting">Приём товара</NavLink></li>
				<li className="collection-item" ><NavLink className="btn" to="/products/shipment">Выдача товара</NavLink></li>
				<li className="collection-item" ><NavLink className="btn" to="/products/funds">Товары на складе</NavLink></li>
				<li className="collection-item" ><NavLink className="btn" to="/products/operations">История операций</NavLink></li>
			</ul>
		</div>
	)
}
