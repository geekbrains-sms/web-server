import React, { useContext, useEffect, useCallback, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Shipments} from '../../components/products/Shipments'
import { Loader } from '../../components/Loader'
import { SideBar } from '../../components/products/SideBar'

export const ProductsShipmentPage = () =>{
	const { token } = useContext(AuthContext)
	const { request, loading } = useHttp()
	const [ data, setData] = useState({})
	const fetchData = useCallback(async () => {
		try {
			const fetchedShipments = await request('/api/v1/transactions/shipment','GET',null,{Authorization: `Bearer ${token}`});
			setData({
				shipments: fetchedShipments	
			})
		} catch (error) {}
	},[request, token])

	useEffect(()=>{
		fetchData()
	},[fetchData])

	return (
		<div className="content">
			<div className="row">
			{ <SideBar/> }
				<div className="col xl8 work-area">
					{ loading ? <Loader /> : <Shipments data={ data } setData={ setData } /> } 
				</div>
			</div>
		</div>
	)
}

