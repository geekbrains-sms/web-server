import React, { useContext, useEffect, useCallback, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Funds} from '../../components/products/Funds'
import { Loader } from '../../components/Loader'
import { SideBar } from '../../components/products/SideBar'

export const ProductsFundsPage = () =>{
	const { token } = useContext(AuthContext)
	const { request, loading } = useHttp()
	const [ data, setData] = useState({})
	const fetchData = useCallback(async () => {
		try {
			const fetchedFunds = await request('/api/v1/funds','GET',null,{Authorization: `Bearer ${token}`});
			setData({
				funds: fetchedFunds
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
					{ loading ? <Loader /> : <Funds data={ data } setData={ setData } /> } 
				</div>
			</div>
		</div>
	)
}

