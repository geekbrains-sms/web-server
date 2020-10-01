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
			contractors: await request('/api/v1/contractors','GET',null,{Authorization: `Bearer ${token}`}),
			funds:  await request(`/api/v1/funds`,'GET',null,{Authorization: `Bearer ${token}`}),
			visible: true 
		});
	}
	const changeHandler = async event => {
		let value = Object.assign({},visible);
		switch (event.target.name){
			case 'product':
				let fund = await request(`/api/v1/funds/product/${event.target.value}`,'GET',null,{Authorization: `Bearer ${token}`});
				value.shipment = value.shipment || {};
				value.fund = fund;
				value.shipment.product = fund.product;
				value.selectedProduct = fund.id;
				value.shipment.quantity = value.shipment.quantity || 1;
				break;
			case 'quantity':
				value.shipment.quantity = event.target.value;
				break;
			case 'contractor':
				value.shipment.contractor = visible.contractors.filter(c => {return c.id == event.target.value})[0];
				break;
			default: break;
		}
		setVisible(value);
	}
	const editHandler = async (id) => {
		let value = Object.assign({}, visible);
		value.shipment = value.shipment || {};
		value.shipment = data.shipments.filter(p => { return p.id === id })[0];		
		value.funds = await request(`/api/v1/funds`,'GET',null,{Authorization: `Bearer ${token}`});
		value.fund = await request(`/api/v1/funds/product/${value.shipment.product.id}`,'GET',null,{Authorization: `Bearer ${token}`});
		value.contractors =  await request('/api/v1/contractors','GET',null,{Authorization: `Bearer ${token}`});
		value.visible = true; 
		value.text =  'Редактирование отгрузки:';
		value.method = 'PUT';
		console.log(value)
		setVisible(value);
	}
	const saveHandler = async () => {
		try {
			var method = visible.method || 'POST';
			let fetchedShipments;
			if (method === 'DELETE') fetchedShipments = await request(`/api/v1/shipments/${visible.shipment.id}`, method, null,{Authorization: `Bearer ${token}`});
			else fetchedShipments = await request('/api/v1/transactions/shipment', method, visible.shipment,{Authorization: `Bearer ${token}`});
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
				<h6>{ visible.text || 'Новая отгрузка товара:' }</h6>
				<div className="row">
					<div className="input-field col xl4">
						<select 
							id="product"
							name="product"
							onChange = { changeHandler }
							defaultValue = { visible.shipment ? visible.shipment.product.id : "" }
							>
							<option key="-1" value="-1"></option>
							{ visible.funds && visible.funds.map(fund => {
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
							defaultValue = { visible.fund ? visible.fund.balance : '' }
						/>
						<label htmlFor = "balance"> В наличии </label>
					</div>
					<div className="col xl1 input-field">
						<input 
							id = "quantity"
							name="quantity"
							type = "text"
							onChange = { changeHandler }
							defaultValue = { visible.shipment ? visible.shipment.quantity : '' }
						/> 
						<label htmlFor = "quantity" >Выдать</label> 
					</div>
					<div className="col xl1 input-field">
						<input 
							name="unit"
							type = "text"
							readOnly
							defaultValue = { visible.shipment ? visible.shipment.product.unit.title : '' }
						/> 
					</div>
					<div className="col xl4 input-field">
						<select
							name="contractor"
							onChange = { changeHandler }
							defaultValue={ visible.shipment && visible.shipment.contractor ? visible.shipment.contractor.id : -1 }
							>
							<option key={ -1 } value="-1"></option>
							{ visible.contractors && visible.contractors.map(contractor => {
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
										<td>{ new Date(shipment.transactionDate).toLocaleString() }</td>
										<td> { shipment.product.title } </td>
										<td> { shipment.quantity } { shipment.product.unit.title } </td>
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