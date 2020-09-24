import React, { useContext, useEffect, useCallback, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { MeasuresList} from '../../components/catalogs/MeasuresList'
import { Loader } from '../../components/Loader'
import { SideBar } from '../../components/catalogs/SideBar'

export const CatalogMeasuresPage = () =>{
	const { token } = useContext(AuthContext)
	const { request, loading} = useHttp()
	const [ measures, setMeasures] = useState({})
	const fetchData = useCallback(async () => {
		try {
			const fetched = await request('/api/v1/measures','GET',null,{Authorization: `Bearer ${token}`});
			setMeasures(fetched)
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
					{ loading ? <Loader /> : <MeasuresList measures={measures} setMeasures={setMeasures} /> } 
				</div>
			</div>
		</div>
	)
}

