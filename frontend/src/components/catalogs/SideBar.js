import React from 'react'
import { NavLink } from 'react-router-dom'

export const SideBar = () =>{
	return (
		<div className="col xl3 menu-sidebar">
			<ul className="collection">
				<li className="collection-item" ><NavLink className="btn" to="/catalogs/products">Товары</NavLink></li>
				<li className="collection-item" ><NavLink className="btn" to="/catalogs/categories">Категории</NavLink></li>
				<li className="collection-item" ><NavLink className="btn" to="/catalogs/measures">Единицы измерения</NavLink></li>
				<li className="collection-item" ><NavLink className="btn" to="/catalogs/contractors">Контрагенты</NavLink></li>
			</ul>
		</div>
	)
}
