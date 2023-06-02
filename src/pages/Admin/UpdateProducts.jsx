import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './UpdateProduct.css';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebase/config';

const UpdateProducts = () => {
    const [uploadError,setUploadError] = useState("");
    const [successMsg,setSuccessMsg] = useState("");
    const location = useLocation();
    const [imageError, setImageError] = useState('');
    
    

    const navigate = useNavigate()
    const {product} = location.state;
    const {id} = location.state;

    

    const [brandName, setBrandName]  = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [productDetails, setProductDetails] = useState("");
    const [productName, setProductName] = useState("");
    const [salt1, setSalt1] = useState("");
    const [powerSalt1, setPowerSalt1] = useState("");
    const [molecule, setMolecule] = useState("");
    const [errorMsg,setErrorMsg] = useState("");

    useEffect(()=>{
        if(!product ){
            navigate('/admin')
        }

        else{
            setBrandName(product.brandName);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setImage(product.image);
            setMolecule(product.molecule);
            setPrice(product.price);
            setProductDetails(product.productDetails);
            setProductName(product.productName);
            setSalt1(product.salt1);
            setPowerSalt1(product.powerSalt1);
            
        }
    },[]);



    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG']
        
    const handleProductImg = (e) =>{
        e.preventDefault();
        let selectedFile = e.target.files[0]

        if(selectedFile) {
            if (selectedFile && types.includes(selectedFile.type)) {
                setImage(selectedFile);
                setImageError('');

            }
            else {
                setImage(null);
                setImageError('please select a valid image file type(png or jpg)')
            }
        }
        else{
            setImageError("Please select an Image first")
        }
    }




    const handleUpdateProducts =(e) =>{
        e.preventDefault();
        const storageREf = ref(storage, `product-images${category.toUpperCase()}/${Date.now()}`)
        uploadBytes(storageREf,image)
            .then(()=>{
                getDownloadURL(storageREf).then(url=>{
                    updateDoc(doc(db,`products-${category.toUpperCase()}`,`${id}`), {
                        product:{
                            brandName,
                            category,
                            countInStock,
                            price,
                            productDetails,
                            productName,
                            salt1,
                            powerSalt1,
                            molecule,
                            // salt2,
                            // powerSalt2,
                            image:url,
                        }
                        
                    }).then(async() => {
                        setSuccessMsg('Product Updated Successfully');
                        // setBrandName(" ");
                        // setCategory(" ");
                        // setCountInStock(" ");
                        // setImage(" ");
                        // setPrice(" ")
                        // setProductDetails(" ");
                        // setProductName(" ");
                        // setSalt1(" ");
                        // setPowerSalt1(" ");
                        // molecule(" ");
                        // navigate('/admin');
                        // setSalt2(" ");
                        // setPowerSalt2(" ");
                        await updateDoc(doc(db, "categories", `${localStorage.getItem('categoryId')}`), {
                            category:arrayUnion(`${category}`),
                          }).then(()=>{
                            navigate('/admin');
                          })

                    }).catch((error) => { setUploadError(error.message) });
                })
            })
        
    }



  return (
    <div className='addprod-container '>
      {product&&
        <div>
            <form action="" className='addprod-form' onSubmit={handleUpdateProducts}>
                <p>Add Products</p>
                {
                    successMsg && 
                        <>
                            <div className="success-msg">
                                {successMsg}
                            </div>
                        </>
                }
                {
                    uploadError && 
                        <>
                            <div className="error-msg">
                                {uploadError}
                            </div>
                        </>
                }
                <label htmlFor="">Brand Name</label>
                <input type="text" placeholder={`${product.brandName}`} onChange={(e)=>{setBrandName(e.target.value)}}/>
                <label>Category</label>
                <input onChange={(e) => setCategory(e.target.value)}  placeholder={`${product.category}`} type="text"  />
                <label>In Stock</label>
                <input onChange={(e) => setCountInStock(e.target.value)}  placeholder={`${product.countInStock}`} type="number"  />
                <label>Molecule of Medicine</label>
                <input onChange={(e) => setMolecule(e.target.value)}  placeholder={`${product.molecule}`} type="text" />
                <label>Price</label>
                <input onChange={(e) => setPrice(e.target.value)}  placeholder={`${product.price}`} type="number" />


                <label>Image</label>
                <div className="prod-img">
                    {product.image &&
                    <img src={`${product.image}`} alt="" />
                    }
                </div>
                <input onChange={handleProductImg} type="file" />
                {imageError && <>
                    <div className='error-msg'>{imageError}</div>
                </>}


                <input onChange={handleProductImg} placeholder='Image' type="capture" />
                <label>Details</label>
                <textarea onChange={(e) => setProductDetails(e.target.value)}  placeholder={`${product.productDetails}`}></textarea>
                <label>Name</label>
                <input onChange={(e) => setProductName(e.target.value)}  placeholder={`${product.productName}`} ></input>
                <label>Salt </label>
                <input onChange={(e) => setSalt1(e.target.value)}  placeholder={`${product.salt1}`} type="text" />
                <label>Power Of Salt(mg)</label>
                <input onChange={(e) => setPowerSalt1(e.target.value)}  placeholder={`${product.powerSalt1}`} type="number"  />

                <button type='submit'>Update</button>
            </form>
        </div> 
      }
    </div>
  )
}

export default UpdateProducts