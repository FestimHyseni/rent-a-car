import { useState, useEffect } from 'react';

function useFetch<T>(url: string | null, skipInitialGet = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url || skipInitialGet) {
      setLoading(false);
      return;
    }
    

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);

  // POST data
  const postData = async (data: any) => {
    try {
      const response = await fetch(url!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  };

  // PUT data
  const putData = async (data: any) => {
    try {
      const response = await fetch(url!, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  };

  // DELETE data
const deleteData = async (deleteUrl: string = url!, bodyData: any = {}) => {
  try {
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

  

  return { data, loading, error, postData, putData, deleteData };
  
}


export default useFetch;