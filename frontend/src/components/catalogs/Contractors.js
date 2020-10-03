import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'

export const Contractors = ({ contractors, setContractors }) => {
	const { token } = useContext(AuthContext)
	const { request, error, clearError } = useHttp()
	const message = useMessage()
	const [visible, setVisible] = useState({contractor: {}, visible: false})
	const contractor = {}

	const createHandler = async () => {
		setVisible({ contractor: {}, visible: true });
	}
	const changeHandler = event => {
		contractor.title = event.target.value
		contractor.id = visible.contractor.id
	}
	const editHandler = (id, value) => {
		setVisible({contractor: {id: id, title: value}, visible: true, text: 'Редактирование контрагента:', method: 'PUT' })
	}
	const saveHandler = async () => {
		try {
			var method = visible.method || 'POST';
			let fetched
			if (method === 'DELETE') fetched = await request(`/api/v1/contractors/${visible.contractor.id}`, method, null,{Authorization: `Bearer ${token}`});
			else fetched = await request('/api/v1/contractors', method, contractor,{Authorization: `Bearer ${token}`});
			setContractors(fetched)
			setVisible(false)
		} catch (error) {}
	}
	const deleteHandler = (id, value) => {
		setVisible({contractor: {id: id, title: value}, visible: true, text: 'Удаление контрагента:', method: 'DELETE' })
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
				<h5>{ visible.text || 'Новый контрагент:' }</h5>
				<div className = "input-field col s12">
					<input 
						id = "title"
						type = "text"
						onChange = { changeHandler }
						defaultValue = { visible.contractor.title }
					/> 
					<label htmlFor = "title" > Наименование </label> 
				</div> 
				<div className="col xl2 offset-xl4"><button className="btn" onClick={ saveHandler }>Сохранить</button></div>
				<div className="col xl2"><button className="btn grey" onClick={ cancelHandler }>Отмена</button></div>
			</div> }
			{ !!contractors.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped">
						<thead>
							<tr>
								<th>Название</th>
							</tr>
						</thead>
						<tbody>
							{ contractors.map(contractor => {
								return (
									<tr key={contractor.id}>
										<td onClick={ editHandler.bind(this, contractor.id, contractor.title) }>{ contractor.title }</td>
										<td onClick={ deleteHandler.bind(this, contractor.id, contractor.title) }><span className="material-icons grey-text">delete</span></td>
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