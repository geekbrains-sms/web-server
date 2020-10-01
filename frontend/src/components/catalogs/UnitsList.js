import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'

export const UnitsList = ({ Units, setUnits }) => {
	const { token } = useContext(AuthContext)
	const { request, error, clearError } = useHttp()
	const message = useMessage()
	const [visible, setVisible] = useState({Unit: {}, visible: false})
	const Unit = {}

	const createHandler = async () => {
		setVisible({ Unit: {}, visible: true });
	}
	const changeHandler = event => {
		Unit.title = event.target.value
		Unit.id = visible.Unit.id
	}
	const editHandler = (id, value) => {
		setVisible({Unit: {id: id, title: value}, visible: true, text: 'Редактирование единицы измерения:', method: 'PUT' })
	}
	const saveHandler = async () => {
		try {
			var method = visible.method || 'POST';
			let fetched
			if (method === 'DELETE') fetched = await request(`/api/v1/units/${visible.Unit.id}`, method, null,{Authorization: `Bearer ${token}`});
			else fetched = await request('/api/v1/units', method, Unit,{Authorization: `Bearer ${token}`});
			setUnits(fetched)
			setVisible(false)
		} catch (error) {}
	}
	const deleteHandler = (id, value) => {
		setVisible({Unit: {id: id, title: value}, visible: true, text: 'Удаление единицы измерения:', method: 'DELETE' })
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
				<h5>{ visible.text || 'Новая единица измерения:' }</h5>
				<div className = "input-field col s12">
					<input 
						id = "title"
						type = "text"
						onChange = { changeHandler }
						defaultValue = { visible.Unit.title }
					/> 
					<label htmlFor = "title" > Наименование </label> 
				</div> 
				<div className="col xl2 offset-xl4"><button className="btn" onClick={ saveHandler }>Сохранить</button></div>
				<div className="col xl2"><button className="btn grey" onClick={ cancelHandler }>Отмена</button></div>
			</div> }
			{ !!Units.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped">
						<thead>
							<tr>
								<th>Название</th>
							</tr>
						</thead>
						<tbody>
							{ Units.map(Unit => {
								return (
									<tr key={Unit.id}>
										<td onClick={ editHandler.bind(this, Unit.id, Unit.title) }>{ Unit.title }</td>
										<td onClick={ deleteHandler.bind(this, Unit.id, Unit.title) }><span className="material-icons grey-text">delete</span></td>
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