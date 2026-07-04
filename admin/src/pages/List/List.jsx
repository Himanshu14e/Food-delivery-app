import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// simple search + confirm delete improvements

const List = ({url}) => {

  const [list, setList] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({ id: null, name: '' });

  const fetchList = async () =>{
    const response = await axios.get(`${url}/api/food/list`)
   
    if(response.data.success){
      setList(response.data.data)
    }
    else{
      toast.error("Error")
    }
  }

  const navigate = useNavigate();

  const removeFood = async (foodId) =>{

    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      await fetchList();
      
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        throw new Error(response.data.message || 'Error occurred while removing food.');
      }
    } catch (error) {
      console.log(error);
      
      // Check if the error has a message and display it in the toast.
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    }
    
  }

  const onRequestRemove = (item) => {
    setConfirmData({ id: item._id, name: item.name });
    setConfirmOpen(true);
  }

  const confirmRemove = async () => {
    setConfirmOpen(false);
    if (confirmData.id) await removeFood(confirmData.id);
    setConfirmData({ id: null, name: '' });
  }

  useEffect(()=>{
    fetchList();
  },[])

  // debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(id);
  }, [query]);
  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-controls">
        <input
          className="list-search"
          placeholder="Search by name or category"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="list-table">
        <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
        </div>
        {list
          .filter((item) => {
            if (!debouncedQuery) return true;
            const q = debouncedQuery.toLowerCase();
            return (
              (item.name || '').toLowerCase().includes(q) ||
              (item.category || '').toLowerCase().includes(q)
            );
          })
          .map((item,index)=>{
          return(
            <div key={index} className="list-table-format">
              <img src={`${url}/images/`+item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <div className='list-actions'>
                <button onClick={() => navigate(`/add?id=${item._id}`)} className='edit-btn'>Edit</button>
                <button onClick={() => onRequestRemove(item)} className='delete-btn'>Delete</button>
              </div>
            </div>
          )
        })}
      </div>

      {confirmOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{confirmData.name}"?</p>
            <div className="modal-actions">
              <button className="btn cancel" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="btn danger" onClick={confirmRemove}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default List