import React, { useContext, useEffect, useCallback, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Contractors} from '../../components/catalogs/Contractors'
import { Loader } from '../../components/Loader'
import { SideBar } from '../../components/catalogs/SideBar'

export const CatalogContractorsPage = () =>{
	const { token } = useContext(AuthContext)
	const { request, loading} = useHttp()
	const [ contractors, setContractors] = useState({})
	const fetchData = useCallback(async () => {
		try {
			const fetched = await request('/api/v1/contractors','GET',null,{Authorization: `Bearer ${token}`});
			setContractors(fetched)
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
					{ loading ? <Loader /> : <Contractors contractors={contractors} setContractors={setContractors} /> } 
				</div>
			</div>
		</div>
	)
}

