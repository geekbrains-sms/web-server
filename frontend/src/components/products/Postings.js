import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'

export const Postings = ({ data, setData }) => {
	const { token } = useContext(AuthContext)
	const { request, error, clearError } = useHttp()
	const message = useMessage()
	const [visible, setVisible] = useState({visible: false})

	const createHandler = async () => {
		setVisible({ visible: true });
	}
	const changeHandler = event => {
		let value = Object.assign({},visible);
		value.posting = value.posting || {};
		switch (event.target.name){
			case 'product':
				value.posting.product = data.products.filter(p => {return p.id == event.target.value})[0];
				value.selectedProduct = event.target.value;
				break;
			case 'quantity':
				value.posting.quantity = event.target.value;
				break;
			default: break;
		}
		setVisible(value);
	}
	const editHandler = (id, value) => {
		let posting = data.postings.filter(p => { return p.id === id })[0];
		setVisible({
			posting: posting,
			selectedProduct: posting.product.id,
			quantity: posting.quantity,
			visible: true, 
			text: 'Исправление данных операции приёма товара:', method: 'PUT' 
		})
	}
	const saveHandler = async () => {
		try {
			var method = visible.method || 'POST';
			let fetched;
			if (method === 'DELETE') fetched = await request(`/api/v1/postings/${visible.posting.id}`, method, null,{Authorization: `Bearer ${token}`});
			else fetched = await request('/api/v1/postings', method, visible.posting,{Authorization: `Bearer ${token}`});
			setVisible({visible: false})
			setData({
				postings: fetched,
				products: data.products
			})
		} catch (error) {
			console.log(error)
		}
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
			<h5>Операции приема товара на склад:</h5>
			{ !visible.visible && <div className="row">
				<div className="col xl1">
					<button className="btn" onClick={ createHandler }>Создать</button>
				</div>
			</div> }
			{ visible.visible && <div className="container-flux">
				<h6>{ visible.text || 'Новое поступление товара:' }</h6>
				<div className="row">
					<div className="input-field col xl5">
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
							onKeyPress = { event => { console.log(event.key); if (event.key === 'Enter') saveHandler() } }
							defaultValue = { visible.quantity }
						/> 
						<label htmlFor = "quantity" > Количество </label> 
					</div>
					<div className="col xl1 input-field">
						<input 
							name="measure"
							type = "text"
							readOnly
							defaultValue = { visible.posting ? visible.posting.product.measure.title : '' }
						/> 
					</div>
					<div className="col xl4 input-field">
						<input 
							name="contractor"
							type = "text"
							readOnly
							defaultValue = { visible.posting ? visible.posting.product.contractor.title : '' }
						/> 
						<label htmlFor = "Контрактор" > Поставщик </label>
					</div>
				</div>
				<div className="row">
					<div className="col xl2 offset-xl8"><button className="btn" onClick={ saveHandler }>Сохранить</button></div>
					<div className="col xl1"><button className="btn grey" onClick={ cancelHandler }>Назад</button></div>
				</div>
			</div> }
			{ !visible.visible && data.postings && !!data.postings.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped">
						<thead>
							<tr>
								<th>Дата</th>
								<th>Товар</th>
								<th>Количество</th>
								<th>Поставщик</th>
								<th>Сотрудник</th>
							</tr>
						</thead>
						<tbody>
							{ data.postings.map(posting => {
								return (
									<tr key={posting.id} onClick={ editHandler.bind(this, posting.id) } >
										<td>{ new Date(posting.postingDate).toLocaleString() }</td>
										<td> { posting.product.title } </td>
										<td> { posting.quantity } { posting.product.measure.title } </td>
										<td> { posting.product.contractor.title } </td>
										<td> { posting.user ? posting.user.lastname : '' } </td>
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