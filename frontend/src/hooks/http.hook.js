import { useState, useCallback, useContext } from 'react'
import {AuthContext} from '../context/AuthContext'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const auth = useContext(AuthContext)

    const request = useCallback(
        async(url, method = 'GET', body = null, headers = {}) => {
            setLoading(true)
            try {
				if (body){
					headers['Content-Type'] = 'application/json';
					body = JSON.stringify(body)
				}
                const response = await fetch(url, { method, body, headers })
                const data = await response.json()

                if (!response.ok) {
					if (response.status === 401){
						auth.showAuthForm(true);
					}
					throw new Error(data.message || 'Что-то пошло не так')
                }
                setLoading(false)
                return data
            } catch (e) {
                setLoading(false)
                setError(e.message)
                throw e
            }
        }, [])
	const clearError = useCallback(() => {setError(null)}, [])
    return { loading, request, error, clearError }
}