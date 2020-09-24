import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'

export const MeasuresList = ({ measures, setMeasures }) => {
	const { token } = useContext(AuthContext)
	const { request, error, clearError } = useHttp()
	const message = useMessage()
	const [visible, setVisible] = useState({measure: {}, visible: false})
	const measure = {}

	const createHandler = async () => {
		setVisible({ measure: {}, visible: true });
	}
	const changeHandler = event => {
		measure.title = event.target.value
		measure.id = visible.measure.id
	}
	const editHandler = (id, value) => {
		setVisible({measure: {id: id, title: value}, visible: true, text: 'Редактирование единицы измерения:', method: 'PUT' })
	}
	const saveHandler = async () => {
		try {
			var method = visible.method || 'POST';
			let fetched
			if (method === 'DELETE') fetched = await request(`/api/v1/measures/${visible.measure.id}`, method, null,{Authorization: `Bearer ${token}`});
			else fetched = await request('/api/v1/measures', method, measure,{Authorization: `Bearer ${token}`});
			setMeasures(fetched)
			setVisible(false)
		} catch (error) {}
	}
	const deleteHandler = (id, value) => {
		setVisible({measure: {id: id, title: value}, visible: true, text: 'Удаление единицы измерения:', method: 'DELETE' })
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
						defaultValue = { visible.measure.title }
					/> 
					<label htmlFor = "title" > Наименование </label> 
				</div> 
				<div className="col xl2 offset-xl4"><button className="btn" onClick={ saveHandler }>Сохранить</button></div>
				<div className="col xl2"><button className="btn grey" onClick={ cancelHandler }>Отмена</button></div>
			</div> }
			{ !!measures.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped">
						<thead>
							<tr>
								<th>Название</th>
							</tr>
						</thead>
						<tbody>
							{ measures.map(measure => {
								return (
									<tr key={measure.id}>
										<td onClick={ editHandler.bind(this, measure.id, measure.title) }>{ measure.title }</td>
										<td onClick={ deleteHandler.bind(this, measure.id, measure.title) }><span className="material-icons grey-text">delete</span></td>
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