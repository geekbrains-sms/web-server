import React, { useState, useEffect, useContext } from 'react'
import { useHttp } from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext'
import { useMessage } from '../../hooks/message.hook'

export const ProductsList = ({ products, setProducts }) => {
	const { token } = useContext(AuthContext)
	const { request, error, clearError} = useHttp()
	const message = useMessage()
	const [visible, setVisible] = useState({product: {}, visible: false})
	let product = {}

	const createHandler = async () => {
		try {
			const fetched = await request('/api/v1/categories','GET',null,{Authorization: `Bearer ${token}`});
			const fetchedMeasures = await request('/api/v1/measures','GET',null,{Authorization: `Bearer ${token}`});
			const fetchedContractors = await request('/api/v1/contractors','GET',null,{Authorization: `Bearer ${token}`});
			setVisible({ 
				product: {}, 
				categories: fetched, 
				measures: fetchedMeasures,
				contractors: fetchedContractors,
				visible: true 
			});
		} catch (error) {}
	}
	const changeHandler = (event) => {
		let value = visible.product
		switch(event.target.name){
			case 'categories':
				value.categories = [];
				var options = event.target.options;
				for (var i = 0; i<options.length; i++){
					if (options[i].selected){
						value.categories.push( visible.categories[options[i].value] ) 
					}
				}
				break
			case 'measure':
				value.measure = visible.measures[event.target.value]; break;
			case 'contractor':
				value.contractor = visible.contractors.filter(c => {return c.id == event.target.value})[0]
				break;
			default: value.title = event.target.value; break;
		}
		product = value;
	}
	const editHandler = async (action,event) => {
		try {
			let id = action === "edit" ? event.target.parentNode.id : event.target.parentNode.parentNode.id
			product = products[id]
			let categories = product.categories
			const fetched = await request('/api/v1/categories','GET',null,{Authorization: `Bearer ${token}`});
			const fetchedMeasures = await request('/api/v1/measures','GET',null,{Authorization: `Bearer ${token}`});
			const fetchedContractors = await request('/api/v1/contractors','GET',null,{Authorization: `Bearer ${token}`});
			let allCtegoriesId = fetched.map((c)=>{return c.id})
			let productCategoriesId = categories.map((c)=>{return c.id })
			let commonId = productCategoriesId.filter(x => allCtegoriesId.includes(x))
			let commonIndex = commonId.map((id) => {return allCtegoriesId.indexOf(id)})
			let selectedMeasure = -1;
			if (product.measure) fetchedMeasures.map((m,i) => {if (m.id === product.measure.id) selectedMeasure = i})
			let selectedContractor = -1;
			if (product.contractor) selectedContractor = product.contractor.id;
			setVisible({
				product: product, 
				categories: fetched, 
				measures: fetchedMeasures,
				contractors: fetchedContractors,
				selected: commonIndex,
				measure: selectedMeasure,
				contractor: selectedContractor,
				visible: true, 
				text: `${action === 'edit' ? 'Редактирование' : 'Удаление'} номенклатуры:`, 
				method: action === 'edit' ? 'PUT' : 'DELETE'
			})			
		} catch (error) {
			console.log(error)
		}
	}
	const saveHandler = async () => {
		try {
			var method = visible.method || 'POST';
			let fetched
			if (method === 'DELETE') fetched = await request(`/api/v1/products/${visible.product.id}`, method, null,{Authorization: `Bearer ${token}`});
			else fetched = await request('/api/v1/products', method, product,{Authorization: `Bearer ${token}`});
			setVisible({visible: false})
			setProducts(fetched)
		} catch (error) {}
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
			{ visible.visible && <div className="container-flux">
				<h5>{ visible.text || 'Новая номенклатура товара:' }</h5>
				<div className="row">
					<div className = "input-field col s12">
						<input 
							id = "title"
							name="title"
							type = "text"
							onChange = { changeHandler }
							defaultValue = { visible.product.title }
						/> 
						<label htmlFor = "title" > Наименование </label> 
					</div>
				</div>
				<div className="row">
					<div className="input-field col xl12">
						<select 
							name="categories"
							multiple 
							onChange = { changeHandler } 
							defaultValue={ visible.selected }>
							{ visible.categories.map((category,index) => {
								return (
									<option key={ category.id } value={ index }>{category.title}</option>
								)
							})}
						</select>
						<label>Категории</label>
					</div>
				</div>
				<div className="row">
					<div className="input-field col xl2">
						<select
							name="measure"
							onChange = { changeHandler }
							defaultValue={ visible.measure }
							>
							<option key={ -1 } value="-1"></option>
							{ visible.measures.map((measure,index) => {
								return (
									<option key={ measure.id } value={ index }>{measure.title}</option>
								)
							})}
						</select>
						<label>Единица измерения</label>
					</div>
					<div className="input-field col xl10">
						<select
							name="contractor"
							onChange = { changeHandler }
							defaultValue={ visible.contractor }
							>
							<option key={ -1 } value="-1"></option>
							{ visible.contractors.map(contractor => {
								return (
									<option key={ contractor.id } value={ contractor.id }>{contractor.title}</option>
								)
							})}
						</select>
						<label>Поставщик</label>
					</div>
					<div className="col xl2 offset-xl6"><button className="btn" onClick={ saveHandler }>Сохранить</button></div>
					<div className="col xl2"><button className="btn grey" onClick={ cancelHandler }>Отмена</button></div>
				</div>
			</div> }
			{ !!products.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped">
						<thead>
							<tr>
								<th>Название</th>
								<th>Ед. измерения</th>
								<th>Категории</th>
								<th>Поставщик</th>
							</tr>
						</thead>
						<tbody>
							{ products.map((product, key) => {
								return (
									<tr key={key}  id={key} >
										<td onClick={ editHandler.bind(this, 'edit') }>{ product.title }</td>
										<td>{ product.measure ? product.measure.title : '' }</td>
										<td> 
											<ul>
												{ product.categories.map(category => {
													return (
														<li key={ category.id }>
															{ category.title }
														</li>
													)
												}) }
											</ul> 
										</td>
											<td> { product.contractor ? product.contractor.title : '' } </td>
										<td onClick={ editHandler.bind(this, 'delete') }><span className="material-icons grey-text">delete</span></td>
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