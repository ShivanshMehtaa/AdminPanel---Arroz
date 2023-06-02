import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Home = () => {
    const navigate = useNavigate();

    // USER AUTHENTICATION CHECKING 
    useEffect(() => {
        if (!localStorage.getItem("user")) {
            navigate('/login');
        }
    }, []);


    // FETCH USER DETAILS 
    function GetCurrentUser() {
        const [user, setUser] = useState("");
        const userCollectionRef = collection(db, "users")
    
        useEffect(() => {
          auth.onAuthStateChanged(userlogged => {
            if (userlogged) {
              const getUsers = async () => {
                const q = query(collection(db, "users"), where("uid", "==", userlogged.uid))
                const data = await getDocs(q);
                setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
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




    //   CHECKING FOR ADMIN 
    if(loggedUser){
        if(loggedUser[0].email == "admin@admin.com"){
            localStorage.setItem('categoryId',loggedUser[0].categoryId);
            navigate('/admin');
        }


    }



    return (
        <div>
            {loggedUser &&
                <p>Home Page</p>
            }
        </div>
    )
}

export default Home