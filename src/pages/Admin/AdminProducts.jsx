import React, { useState } from 'react';
import './Admin.css';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import UpdateProducts from './UpdateProducts';

const AdminProducts = (products) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const product = products.products.product;
  const navigate = useNavigate();
  // const handleDelete=async(id,category)=>{

  //   console.log(id);
  //   console.log(category);
  // }


  return (
    <div className='new-admin-products'>
      <div className="details">
        {product.image&&
          <div className="prod-img">  
          <img src={product.image} alt="" />
        </div>
        }
        
      <div className="prod-details">
        <div className="name">Name: {product.productName}</div>
        <div className="brand">Brand: {product.brandName}</div>
        <div className="available">{
          product.countInStock>0?"Available":"Unavailable"
        }</div>
        <div className="price">Price: ₹{product.price}</div>
      </div>

      </div>
      <div className="edit"><Link state={{product:product, id:products.products.id}} to={'/updateProducts'}>Edit</Link></div>
      <div className="delete" onClick={async() => {


        // DELETING PRODUCTS 
        const deleteRef =  doc(db,`products-${product.category.toUpperCase()}/${products.products.id}`);
        console.log(`products-${product.category.toUpperCase()}/${products.products.id}`);
        await deleteDoc(deleteRef)
        .then(() => {
          setSuccessMsg("Deleted Successfully");
          console.log(successMsg);
          navigate(0);
        }).catch((error) => {
          setErrorMsg(error.message);
        })
        // DELETING PRODUCTS 


      }}>Delete</div>
    </div>
  )
}

export default AdminProducts