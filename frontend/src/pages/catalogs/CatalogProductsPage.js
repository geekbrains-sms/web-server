import React, { useContext, useEffect, useCallback, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { ProductsList} from '../../components/catalogs/ProductsList'
import { Loader } from '../../components/Loader'
import { SideBar } from '../../components/catalogs/SideBar'

export const CatalogProductsPage = () =>{
	const { token } = useContext(AuthContext)
	const { request, loading } = useHttp()
	const [ products, setProducts] = useState({})
	const fetchData = useCallback(async () => {
		try {
			const fetched = await request('/api/v1/products','GET',null,{Authorization: `Bearer ${token}`});
			setProducts(fetched)
		} catch (error) {
			console.log(error)
		}
	},[token, request])

	useEffect(()=>{
		fetchData()
	},[fetchData])

	return (
		<div className="content">
			<div className="row">
			{ <SideBar/> }
				<div className="col xl8 work-area">
					{ loading ? <Loader /> : <ProductsList products={products} setProducts={setProducts} /> } 
				</div>
			</div>
		</div>
	)
}

