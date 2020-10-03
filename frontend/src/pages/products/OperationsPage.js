import React, { useContext, useEffect, useCallback, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Actions} from '../../components/products/Actions'
import { Loader } from '../../components/Loader'
import { SideBar } from '../../components/products/SideBar'

export const ProductsOperationPage = () =>{
	const { token } = useContext(AuthContext)
	const { request, loading } = useHttp()
	const [ data, setData] = useState({})
	const fetchData = useCallback(async () => {
		try {
			const fetchedActions = await request('/api/v1/actions','GET',null,{Authorization: `Bearer ${token}`});
			setData({
				actions: fetchedActions
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
					{ loading ? <Loader /> : <Actions data={ data } setData={ setData } /> } 
				</div>
			</div>
		</div>
	)
}

