import { useState, useEffect } from 'react';

export function useFetch() {
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    useEffect(() => {
        const url = 'https://www.themealdb.com/api/json/v1/1/search.php?f=a'
        setLoading(true)
        fetch(url)
            .then((response) => response.json()) 
            .then((data) => setData(data))
            .catch((error) => setError(error))
            .finally(()=> setLoading(false))


    }, []);
    return {data, loading, error}
}