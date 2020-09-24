import React, { useEffect } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'

export const Funds = ({ data, setData }) => {
	const { error, clearError } = useHttp()
	const message = useMessage()
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
			<h6>Список товаров в наличии на складе:</h6>
			{ data.funds && !!data.funds.length && <div className="row">
				<div className="col xl12">
					<table className="my-table-class-1 striped">
						
						<thead>
							<tr>
								<th>Товар</th>
								<th>Поставщик</th>
								<th>Количество</th>
								<th>Категории</th>
							</tr>
						</thead>
						<tbody>
							{ data.funds.map(fund => {
								return (
									<tr key={fund.id}>
										<td> { fund.product.title } </td>
										<td> { fund.product.contractor.title } </td>
										<td> { fund.balance } { fund.product.measure.title } </td>
										<td>
											<ul>
												{ fund.product.categories.map(category => {
													return (
														<li key={ category.id }>
															{ category.title }
														</li>
													)
												}) }
											</ul>
										</td>
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