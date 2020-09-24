import React, { useContext, useEffect, useCallback, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Postings} from '../../components/products/Postings'
import { Loader } from '../../components/Loader'
import { SideBar } from '../../components/products/SideBar'

export const ProductsPostingPage = () =>{
	const { token } = useContext(AuthContext)
	const { request, loading } = useHttp()
	const [ data, setData] = useState({})
	const fetchData = useCallback(async () => {
		try {
			const fetchedPostings = await request('/api/v1/postings','GET',null,{Authorization: `Bearer ${token}`});
			const fetchedProducts = await request('/api/v1/products','GET',null,{Authorization: `Bearer ${token}`});
			setData({
				postings: fetchedPostings,
				products: fetchedProducts
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
					{ loading ? <Loader /> : <Postings data={ data } setData={ setData } /> } 
				</div>
			</div>
		</div>
	)
}

