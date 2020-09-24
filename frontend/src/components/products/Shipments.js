import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'

export const Shipments = ({ data, setData }) => {
	const { token } = useContext(AuthContext)
	const { request, error, clearError } = useHttp()
	const message = useMessage()
	const [visible, setVisible] = useState({ visible: false })

	const createHandler = async () => {
		setVisible({ 
			selectedProduct: -1,
			contractors: data.contractors,
			visible: true 
		});
	}
	const changeHandler = event => {
		let value = Object.assign({},visible);
		switch (event.target.name){
			case 'product':
				let fund = data.funds.filter(p => {return p.id == event.target.value})[0];
				value.shipment = value.shipment || {};
				value.shipment.product = fund.product;
				value.product = fund;
				value.selectedProduct = event.target.value;
				value.balance = fund.balance;
				break;
			case 'quantity':
				value.shipment.quantity = event.target.value;
				break;
			case 'contractor':
				value.shipment.contractor = data.contractors.filter(c => {return c.id == event.target.value})[0];
				break;
			default: break;
		}
		setVisible(value);
	}
	const editHandler = (id) => {
		let value = Object.assign({}, visible);
		value.shipment = data.shipments.filter(p => { return p.id === id })[0];
		value.product = data.funds.filter(p => { return p.id === value.shipment.product.id })[0] || {
			id: value.shipment.product.id,
			productTitle: value.shipment.product.title,
			balance: 0,
			measureTitle: value.shipment.product.measure.title
		}
		value.selectedProduct = value.shipment.product.id;
		value.contractor = value.shipment.contractor.id;
		value.quantity = value.shipment.quantity;
		value.visible = true; 
		value.text =  'Редактирование отгрузки:';
		value.method = 'PUT';
		setVisible(value);
	}
	const saveHandler = async () => {
		try {
			var method = visible.method || 'POST';
			let fetchedShipments;
			if (method === 'DELETE') fetchedShipments = await request(`/api/v1/shipments/${visible.shipment.id}`, method, null,{Authorization: `Bearer ${token}`});
			else fetchedShipments = await request('/api/v1/shipments', method, visible.shipment,{Authorization: `Bearer ${token}`});
			const fetchedFunds = await request('/api/v1/funds','GET',null,{Authorization: `Bearer ${token}`});
			const fetchedContractors = await request('/api/v1/contractors','GET',null,{Authorization: `Bearer ${token}`});
			
			setVisible({visible: false})
			setData({
				shipments: fetchedShipments,
				funds: fetchedFunds,
				contractors: fetchedContractors
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
			<h6>Операции выдачи товаров со склада:</h6>
			{ !visible.visible && <div className="row">
				<div className="col xl1">
					<button className="btn" onClick={ createHandler }>Создать</button>
				</div>
			</div> }
			{ visible.visible && <div className="container-flux">
				<h5>{ visible.text || 'Новая отгрузка товара:' }</h5>
				<div className="row">
					<div className="input-field col xl4">
						<select 
							id="product"
							name="product"
							onChange = { changeHandler }
							defaultValue = { visible.selectedProduct }
							>
							<option key="-1" value="-1"></option>
							{ data.funds && data.funds.map(fund => {
								return (
									<option key={ fund.id } value={ fund.id }>{ fund.product.title }</option>
								)
							}) }
						</select>
						<label htmlFor = "product"> Товар </label> 
					</div>
					<div className="col xl2 input-field">
						<input 
							name="balance"
							type = "text"
							readOnly
							defaultValue = { visible.product ? visible.product.balance : '' }
						/>
						<label htmlFor = "balance"> В наличии </label>
					</div>
					<div className="col xl1 input-field">
						<input 
							id = "quantity"
							name="quantity"
							type = "text"
							onChange = { changeHandler }
							defaultValue = { visible.quantity }
						/> 
						<label htmlFor = "quantity" >Выдать</label> 
					</div>
					<div className="col xl1 input-field">
						<input 
							name="measure"
							type = "text"
							readOnly
							defaultValue = { visible.shipment ? visible.shipment.product.measure.title : '' }
						/> 
					</div>
					<div className="col xl4 input-field">
						<select
							name="contractor"
							onChange = { changeHandler }
							defaultValue={ visible.contractor }
							>
							<option key={ -1 } value="-1"></option>
							{ data.contractors.map(contractor => {
								return (
									<option key={ contractor.id } value={ contractor.id }>{contractor.title}</option>
								)
							})}
						</select>
						<label htmlFor = "contractor"> Получатель </label> 
					</div>
				</div>
				<div className="row">
					<div className="col xl2 offset-xl8"><button className="btn" onClick={ saveHandler }>Сохранить</button></div>
					<div className="col xl1"><button className="btn grey" onClick={ cancelHandler }>Назад</button></div>
				</div>
			</div> }
			{ data.shipments && !!data.shipments.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped">
						<thead>
							<tr>
								<th>Дата</th>
								<th>Товар</th>
								<th>Количество</th>
								<th>Получатель</th>
								<th>Сотрудник</th>
							</tr>
						</thead>
						<tbody>
							{ data.shipments.map(shipment => {
								return (
									<tr key={shipment.id} onClick={ editHandler.bind(this, shipment.id) }>
										<td>{ new Date(shipment.shipmentDate).toLocaleString() }</td>
										<td> { shipment.product.title } </td>
										<td> { shipment.quantity } { shipment.product.measure.title } </td>
										<td> { shipment.contractor ? shipment.contractor.title : '' } </td>
										<td> { shipment.user ? shipment.user.lastname : '' } </td>
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