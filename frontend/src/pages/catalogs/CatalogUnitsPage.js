import React, { useContext, useEffect, useCallback, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { UnitsList} from '../../components/catalogs/UnitsList'
import { Loader } from '../../components/Loader'
import { SideBar } from '../../components/catalogs/SideBar'

export const CatalogUnitsPage = () =>{
	const { token } = useContext(AuthContext)
	const { request, loading} = useHttp()
	const [ Units, setUnits] = useState({})
	const fetchData = useCallback(async () => {
		try {
			const fetched = await request('/api/v1/units','GET',null,{Authorization: `Bearer ${token}`});
			setUnits(fetched)
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
					{ loading ? <Loader /> : <UnitsList Units={Units} setUnits={setUnits} /> } 
				</div>
			</div>
		</div>
	)
}

