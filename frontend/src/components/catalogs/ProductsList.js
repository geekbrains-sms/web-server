import React, { useState, useEffect, useContext } from 'react'
import ReactFileReader from 'react-file-reader'
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
			const fetchedUnits = await request('/api/v1/units','GET',null,{Authorization: `Bearer ${token}`});
			const fetchedContractors = await request('/api/v1/contractors','GET',null,{Authorization: `Bearer ${token}`});
			setVisible({ 
				product: {}, 
				categories: fetched, 
				units: fetchedUnits,
				contractors: fetchedContractors,
				visible: true 
			});
		} catch (error) {}
	}
	const fileHandler = files => {
		let value = Object.assign({},visible);
		value.product.image = {
			title: files.fileList[0].name,
			image: files.base64
		}
		setVisible(value);
	}
	const changeHandler = (event) => {
		let value = Object.assign({},visible);
		switch(event.target.name){
			case 'categories':
				value.product.categories = [];
				var options = event.target.options;
				for (var i = 0; i<options.length; i++){
					if (options[i].selected){
						value.product.categories.push( visible.categories[options[i].value] ) 
					}
				}
				break
			case 'categoriesText':
				value.product.categories = event.target.value.split(', ').map(value => {return {title: value} })
				break;
			case 'unitText':
				value.product.unit = {title: event.target.value };
				break;
			case 'unit':
				value.product.unit = visible.units[event.target.value]; break;
			default: value.product.title = event.target.value; break;
		}
		product = value.product;
	}
	const editHandler = async (action,event) => {
		try {
			let id = action === "edit" ? event.target.parentNode.id : event.target.parentNode.parentNode.id
			product = products[id]
			let categories = product.categories
			const fetched = await request('/api/v1/categories','GET',null,{Authorization: `Bearer ${token}`});
			const fetchedUnits = await request('/api/v1/units','GET',null,{Authorization: `Bearer ${token}`});
			const fetchedContractors = await request('/api/v1/contractors','GET',null,{Authorization: `Bearer ${token}`});
			let allCtegoriesId = fetched.map((c)=>{return c.id})
			let productCategoriesId = categories.map((c)=>{return c.id })
			let commonId = productCategoriesId.filter(x => allCtegoriesId.includes(x))
			let commonIndex = commonId.map((id) => {return allCtegoriesId.indexOf(id)})
			let selectedUnit = -1;
			if (product.unit) fetchedUnits.map((m,i) => {if (m.id === product.unit.id) selectedUnit = i})
			let selectedContractor = -1;
			if (product.contractor) selectedContractor = product.contractor.id;
			setVisible({
				product: product, 
				categories: fetched, 
				units: fetchedUnits,
				contractors: fetchedContractors,
				selected: commonIndex,
				unit: selectedUnit,
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
			else fetched = await request('/api/v1/products', method, visible.product,{Authorization: `Bearer ${token}`});
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
					<div className="col xl3 left">
						<ReactFileReader handleFiles={ fileHandler } base64={true} multipleFiles={false}>	
							{	visible.product.image 
								? <img className="responsive-img" src={ visible.product.image.image} alt=""/> 
								: <div>Фото нет</div> 
							}
						</ReactFileReader>
					</div>
					<div className = "col xl9">
						<div className="row">
							<div className="input-field col xl12">
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
							<div className="input-field col xl9">
								<input 
									id = "categoriesText"
									name="categoriesText"
									type = "text"
									onChange = { changeHandler }
									defaultValue = { 
										visible.product.categories 
										? visible.product.categories.map(category => category.title).join(', ')
										: ''}
								/>
								<label htmlFor="categoriesText">Категории</label>	
							</div>
							<div className=" input-field btn btn-small"> Выбрать </div>						 
						</div>
						<div className="row">
							<div className = "input-field col xl9">
								<input 
									id = "unitText"
									name="unitText"
									type = "text"
									onChange = { changeHandler }
									defaultValue = { visible.product.unit ? visible.product.unit.title : '' }
								/> 
								<label htmlFor = "title" > Единицы измерения </label> 
							</div>
							<div className=" input-field btn-small">
								Выбрать
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col xl2 offset-xl6"><button className="btn" onClick={ saveHandler }>Сохранить</button></div>
					<div className="col xl2"><button className="btn grey" onClick={ cancelHandler }>Отмена</button></div>
				</div>
			</div> }
			{ !!products.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped responsive-table">
						<thead>
							<tr>
								<th colSpan="2">Название</th>
								<th>Ед. измерения</th>
								<th>Категории</th>
							</tr>
						</thead>
						<tbody>
							{ products.map((product, key) => {
								return (
									<tr key={key}  id={key} >
										<td><img width="30rem" src={ product.image ? product.image.image : ""} alt=""/></td>
										<td onClick={ editHandler.bind(this, 'edit') }>{ product.title }</td>
										<td>{ product.unit ? product.unit.title : '' }</td>
										<td> 
											<ul>
												{ product.categories && product.categories.map(category => {
													return (
														<li key={ category.id }>
															{ category.title }
														</li>
													)
												}) }
											</ul> 
										</td>
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