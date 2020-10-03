import React, { useContext, useEffect, useCallback, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CategoriesList} from '../../components/catalogs/CategoriesList'
import { Loader } from '../../components/Loader'
import { SideBar } from '../../components/catalogs/SideBar'

export const CatalogCategoriesPage = () =>{
	const { token } = useContext(AuthContext)
	const { request, loading } = useHttp()
	const [ categories, setCategories] = useState({})
	const fetchData = useCallback(async () => {
		try {
			const fetched = await request('/api/v1/categories','GET',null,{Authorization: `Bearer ${token}`});
			setCategories(fetched)
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
					{ loading ? <Loader /> : <CategoriesList categories={categories} setCategories={setCategories} /> } 
				</div>
			</div>
		</div>
	)
}

