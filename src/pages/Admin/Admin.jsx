import React, { useState ,useEffect} from 'react';
import { db } from '../../firebase/config';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import AdminProducts from './AdminProducts';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [errorMsg,setErrorMsg] = useState("");
  const [successMsg,setSuccessMsg] = useState("");
  const [products,setProducts] = useState([]);
  const [categories,setcategories] = useState([]);
  const [options,setOptions] = useState("");
  const [path,setPath] = useState("");
  // let path = '';



  // function changePath(path){
  //     setPath(`${path}`);
  //     console.log("Path Changed= "+path);
  //   }



  // FETCHING PRODUCTS FOR ADMIN 
  useEffect(()=>{
    const getProducts=()=>{

console.log(path);
      const productsList = [];

      getDocs(collection(db,`${path?`${path}`:"products"}`)).then((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
          productsList.push({...doc.data(),id:doc.id})
        })
        if(path == ""){
          setProducts(productsList);
        }else{
          setProducts(productsList);
        }
        setSuccessMsg("Products Fetched");
      }).catch((error)=>{
        // console.log(error.message);
        setErrorMsg(error.message);
      })
    }
    getProducts();
  },[path])
  console.log(products);



  // FETCHING CATEGORIES FOR ADMIN 
  function GetCategories(){
    useEffect(() => {
        const getCategories = async() => {
            const docRef = doc(db, 'categories', `${localStorage.getItem('categoryId')}`);
            const docSnap = await getDoc(docRef);
            setcategories(docSnap.data().category);
            // console.log("Categories = "+docSnap.data().category);
        }
        getCategories();

    }, [])
    return categories
}
GetCategories();

// HANDLING CATEGORY CHANGES 
const handleCategoryChange=(e)=>{
  console.log(e.target.value);
  const c = (e.target.value).toUpperCase();
  setPath(`products-${c}`);
}

  return (
<>
{categories&&products&&
    <div className='admin'>

      <div className="topbar">
        <p>Admin Page</p>
      </div>


    <div className="admin-dashboard">

      <div className="categories">
        <p>Select Categories</p>


        <select id="" onChange={handleCategoryChange}>
        <option value="default" hidden>Select Category</option>
        {
          categories.map((c,key)=>{
            return <option key={key} value={`${c}`}>{c}</option>
})
        }
        </select>


        <div className="add-products">
        <Link to="/addProduct">Add</Link>
      </div>
      </div>

      <div className="admin-products">
        {products.map((product)=>(
          <AdminProducts key={product.id} products={product} />
          ))}
      </div>

      </div>

  
    </div>
    }
    </>

  )
}

export default Admin