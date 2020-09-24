import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'

export const CategoriesList = ({ categories, setCategories }) => {
	const { token } = useContext(AuthContext)
	const { request, error, clearError } = useHttp()
	const message = useMessage()
	const [visible, setVisible] = useState({category: {}, visible: false})
	const category = {}

	const createHandler = async () => {
		setVisible({ category: {}, visible: true });
	}
	const changeHandler = event => {
		category.title = event.target.value
		category.id = visible.category.id
	}
	const editHandler = (id, value) => {
		setVisible({category: {id: id, title: value}, visible: true, text: 'Редактирование категории:', method: 'PUT' })
	}
	const saveHandler = async () => {
		try {
			var method = visible.method || 'POST';
			let fetchCategories;
			if (method === 'DELETE') fetchCategories = await request(`/api/v1/categories/${visible.category.id}`, method, null,{Authorization: `Bearer ${token}`});
			else fetchCategories = await request('/api/v1/categories', method, category,{Authorization: `Bearer ${token}`});
			setCategories(fetchCategories)
		} catch (error) {}
	}
	const deleteHandler = (id, value) => {
		setVisible({category: {id: id, title: value}, visible: true, text: 'Удаление категории:', method: 'DELETE' })
	}
	const cancelHandler = () => {
		setVisible({visible: false})
	}
	useEffect(()=>{ 
		window.M.AutoInit()
	})
	useEffect(()=>{
		window.M.updateTextFields()
	})
	useEffect(()=>{
		message(error)
		clearError()
	},[error, message, clearError])
	return (
		<div className="container-flux">
			{ !visible.visible && <div className="row">
				<div className="col xl1">
					<button className="btn" onClick={ createHandler }>Создать</button>
				</div>
			</div> }
			{ visible.visible && <div className="row">
				<h5>{ visible.text || 'Новая категория товаров:' }</h5>
				<div className = "input-field col s12">
					<input 
						id = "title"
						type = "text"
						onChange = { changeHandler }
						defaultValue = { visible.category.title }
					/> 
					<label htmlFor = "title" > Наименование </label> 
				</div> 
				<div className="col xl2 offset-xl4"><button className="btn" onClick={ saveHandler }>Сохранить</button></div>
				<div className="col xl2"><button className="btn grey" onClick={ cancelHandler }>Отмена</button></div>
			</div> }
			{ !!categories.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped">
						<thead>
							<tr>
								<th>Название</th>
							</tr>
						</thead>
						<tbody>
							{ categories.map(category => {
								return (
									<tr key={category.id}>
										<td onClick={ editHandler.bind(this, category.id, category.title) }>{ category.title }</td>
										<td onClick={ deleteHandler.bind(this, category.id, category.title) }><span className="material-icons grey-text">delete</span></td>
									</tr>
								)
							}) }
						</tbody>
					</table>		
				</div>
			</div> }
		</div>
	)
}