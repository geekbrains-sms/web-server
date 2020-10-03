import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'

export const Actions = ({ data, setData }) => {
	const { token } = useContext(AuthContext)
	const { request, error, clearError } = useHttp()
	const message = useMessage()
	const [visible, setVisible] = useState({visible: false})

	const createHandler = async () => {
		setVisible({ action: {product:{measure: {}}}, visible: true, selectedProduct: -1 });
	}
	const changeHandler = event => {
		let value = {};
		value.action = visible.action;
		value.product = visible.product;
		value.selectedProduct = visible.selectedProduct;
		value.quantity = visible.quantity;
		value.visible = visible.visible;
		switch (event.target.name){
			case 'product':
				value.action.product = data.products.filter(p => {return p.id == event.target.value})[0];
				value.selectedProduct = event.target.value;
				break;
			case 'quantity':
				value.action.quantity = event.target.value;
				break;
			default: break;
		}
		setVisible(value);
	}
	const editHandler = (id, value) => {
		let action = data.actions.filter(p => { return p.id === id })[0];
		setVisible({
			action: action,
			selectedProduct: action.product.id,
			quantity: action.quantity,
			visible: true, 
			text: 'Редактирование поступления:', method: 'PUT' 
		})
	}
	const saveHandler = async () => {
		try {
			var method = visible.method || 'POST';
			let fetched;
			if (method === 'DELETE') fetched = await request(`/api/v1/actions/${visible.action.id}`, method, null,{Authorization: `Bearer ${token}`});
			else fetched = await request('/api/v1/actions', method, visible.action,{Authorization: `Bearer ${token}`});
			setVisible({visible: false})
			setData({
				actions: fetched,
				products: data.products
			})
		} catch (error) {
			console.log(error)
		}
	}
	const deleteHandler = (id, value) => {
		let action = data.actions.filter(p => { return p.id === id })[0];
		setVisible({
			action: action,
			selectedProduct: action.product.id,
			quantity: action.quantity,
			visible: true, 
			text: 'Удаление поступления:', method: 'DELETE' 
		})
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
			<h6>История действий пользователей:</h6>
			{ visible.visible && <div className="container-flux">
				<h5>{ visible.text || 'Новое поступление товара:' }</h5>
				<div className="row">
					<div className="input-field col xl6">
						<select 
							id="product"
							name="product"
							onChange = { changeHandler }
							defaultValue = { visible.selectedProduct }
							>
							<option key="-1" value="-1"></option>
							{ data.products && data.products.map(product => {
								return (
									<option key={ product.id } value={ product.id }>{ product.title }</option>
								)
							}) }
						</select>
						<label htmlFor = "product"> Товар </label> 
					</div>
					<div className="col xl2 input-field">
						<input 
							id = "quantity"
							name="quantity"
							type = "text"
							onChange = { changeHandler }
							defaultValue = { visible.quantity }
						/> 
						<label htmlFor = "quantity" > Количество </label> 
					</div>
					<div className="col xl1 input-field">
						<input 
							name="measure"
							type = "text"
							readOnly
							defaultValue = { visible.action.product.measure.title }
						/> 
					</div>
				</div>
				<div className="row">
					<div className="col xl2 offset-xl6"><button className="btn" onClick={ saveHandler }>Сохранить</button></div>
					<div className="col xl2"><button className="btn grey" onClick={ cancelHandler }>Отмена</button></div>
				</div>
			</div> }
			{ data.actions && !!data.actions.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped">
						<thead>
							<tr>
								<th>Дата</th>
								<th>Пользователь</th>
								<th>Операция</th>
								<th>Товар</th>
							</tr>
						</thead>
						<tbody>
							{ data.actions.map(action => {
								return (
									<tr key={action.id}>
										<td>{ new Date(action.data).toLocaleString() }</td>
										<td> { action.authorName } </td>
										<td> { action.type }</td>
										<td> { action.productName }</td>
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