import React, {useState, useEffect } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'

const Add = ({url}) => {

    const [image, setImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState({
        name:'',
        description:'',
        price:'',
        category:'Salad'
    })

    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const onSubmitHandler = async (event) =>{
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('price', Number(data.price))
        formData.append('category', data.category)

        let response;
        if (isEdit) {
            formData.append('id', editId);
            // only append image file if user selected a new file
            if (image && image instanceof File) {
                formData.append('image', image);
            }
            response = await axios.post(`${url}/api/food/update`, formData);
        } else {
            formData.append('image', image);
            response = await axios.post(`${url}/api/food/add`, formData);
        }

        if(response.data.success){
            setData({
                name:'',
                description:'',
                price:'',
                category:'Salad'
            })
            setImage(false);
            setImagePreview(null);
            if (isEdit) {
              toast.success('Product updated');
              navigate('/list');
              return;
            }
            toast.success(response.data.message)
        }else{
            toast.error(response.data.message)
        }
    }

    useEffect(()=>{
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if(id){
            // load item and prefill
            (async () =>{
                try{
                    const resp = await axios.get(`${url}/api/food/list`);
                    if(resp.data.success){
                        const item = resp.data.data.find(i=> i._id === id);
                        if(item){
                            setData({
                                name: item.name || '',
                                description: item.description || '',
                                price: item.price || '',
                                category: item.category || 'Salad'
                            })
                            setImagePreview(`${url}/images/${item.image}`)
                            setIsEdit(true);
                            setEditId(id);
                        }
                    }
                }catch(err){
                    console.error(err)
                }
            })();
        }
    },[location.search])

  return (
    <div className='add'>
        <form  className="flex-col" onSubmit={onSubmitHandler}>
            <div className="add-img-upload flex-col">
                <p>Upload Image</p>
                <label htmlFor="image">
                    <img src={image ? (image instanceof File ? URL.createObjectURL(image) : image) : (imagePreview || assets.upload_area)} alt="" />
                </label>
                <input onChange={(e)=>{ setImage(e.target.files[0]); setImagePreview(URL.createObjectURL(e.target.files[0])); }} type="file" id='image' hidden required={!isEdit} />
            </div>
            <div className="add-product-name flex-col">
                <p>Product name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here' />
            </div>
            <div className="add-product-description flex-col">
                <p>Product description</p>
                <textarea onChange={onChangeHandler} value={data.description} name="description" rows='6' placeholder='Write content here' required></textarea>
            </div>
            <div className="add-category-price">
                <div className="add-category flex-col">
                    <p>Product category</p>
                    <select onChange={onChangeHandler}  name="category">
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="Pasta">Pasta</option>
                        <option value="Noodles">Noodles</option>
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>Product price</p>
                    <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='₹20'/>
                </div>
            </div>
            <button type='submit' className='add-btn'>ADD</button>
        </form>
    </div>
  )
}

export default Add