import React, { useState, useEffect } from 'react'
import { auth, db, storage } from '../../firebase/config'
import { collection, getDocs, query, where, doc, updateDoc, addDoc, arrayUnion, setDoc } from 'firebase/firestore'
import './AddProducts.css'
import { useNavigate } from 'react-router-dom'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const AddProducts = () => {

    // const [producttitle, setProductTitle] = useState("");
    // const [producttype, setProductType] = useState("")
    // const [keyspecs, setKeyspecs] = useState("")
    // const [description, setDescription] = useState("");
    // const [brand, setBrand] = useState("")
    // const [customersupport, setCustomersupport] = useState("")
    // const [price, setPrice] = useState("")
    // const [warranty, setWarranty] = useState("")
    // const [productimage, setProductImage] = useState("")
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
    // const [salt2, setSalt2] = useState("");
    // const [powerSalt2, setPowerSalt2] = useState("");

    const navigate = useNavigate()
    const [imageError, setImageError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');


    function GetCurrentUser() {
        const [user, setUser] = useState(null);
        const usersCollectionRef = collection(db, "users");
        useEffect(() => {
            auth.onAuthStateChanged(userlogged => {
                if (userlogged) {
                    // console.log(userlogged.email)
                    const getUsers = async () => {
                        const q = query(usersCollectionRef, where("uid", "==", userlogged.uid));
                        console.log(q);
                        const data = await getDocs(q);
                        setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                    };
                    getUsers();
                }
                else {
                    setUser(null);
                }
            })
        }, [])
        return user
    }
    
    const loggedUser = GetCurrentUser();
    // if (loggedUser) { console.log(loggedUser[0].email) }
    
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

    const handleAddProduct =(e) =>{
        e.preventDefault();
        const storageREf = ref(storage, `product-images${category.toUpperCase()}/${Date.now()}`)
        // console.log(storageREf._location.path)
        uploadBytes(storageREf,image)
            .then(()=>{
                getDownloadURL(storageREf).then(url=>{
                    addDoc(collection(db,`products-${category.toUpperCase()}`), {
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
                        setSuccessMsg('Product added successfully');
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
    <div className='addprod-container'>
      {
        loggedUser && loggedUser[0].email === "admin@admin.com" ?
        <div>
            <form action="" className='addprod-form' onSubmit= {handleAddProduct}>
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
                <input type="text" placeholder='Product Name' onChange={(e)=>{setBrandName(e.target.value)}}/>
                <label>Category</label>
                <input onChange={(e) => setCategory(e.target.value)} type="text" placeholder="Category" />
                <label>In Stock</label>
                <input onChange={(e) => setCountInStock(e.target.value)} type="number" placeholder="In Stock Value" />
                <label>Molecule of Medicine</label>
                <input onChange={(e) => setMolecule(e.target.value)} type="text" placeholder="Molecule of Medicine" />
                <label>Price</label>
                <input onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Price" />
                <label>Image</label>
                <input onChange={handleProductImg} type="file" />
                {imageError && <>
                    <div className='error-msg'>{imageError}</div>
                </>}
                <input onChange={handleProductImg} placeholder='Image' type="capture" />
                <label>Details</label>
                <textarea onChange={(e) => setProductDetails(e.target.value)} placeholder="Enter details of Medicine"></textarea>
                <label>Name</label>
                <input onChange={(e) => setProductName(e.target.value)} placeholder="Medicine Name"></input>
                <label>Salt </label>
                <input onChange={(e) => setSalt1(e.target.value)} type="text" placeholder="Salt Name" />
                <label>Power Of Salt(mg)</label>
                <input onChange={(e) => setPowerSalt1(e.target.value)} type="number" placeholder="Power of salt(mg)" />
                {/* <label>Salt 2 </label>
                <input onChange={(e) => setSalt2(e.target.value)} type="text" placeholder="Enter Price without tax" />
                <label>Power Of Salt 2(mg)</label>
                <input onChange={(e) => setPowerSalt2(e.target.value)} type="number" placeholder="Customer Support Email, Phone or address" /> */}

                <button type='submit'>Add</button>
            </form>
        </div> 
        : <div> You cannot access this page. If you should then please contact the administrators</div>
      }
    </div>
  )
}

export default AddProducts
