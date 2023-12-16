
import '../App.css';

import { animate, motion } from "framer-motion"

import React, { useState, useEffect} from 'react';


import { Outlet, Link, useNavigate} from "react-router-dom";


import logo from "../asstes/logo.png"
import background from "../asstes/background.jpg"

import phone from "../asstes/phone.png"
import loadingIcon from "../asstes/loadingIcon.gif"


import log from "../asstes/logo.svg"
import qr from "../asstes/qr.svg"


import {db} from "../Components/database_config/firebaseConfig"
import firebase from 'firebase/compat/app';
import { collection, getDocs, query, where } from '@firebase/firestore';

const Home = () => {
  
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const [showDashboard, setShowDashboard] = useState(false);

  const HandleLogin = async (e) => {
    e.preventDefault();

    console.log(email);
    console.log(password)
    
    setLoading(!loading)

    const q = query(collection(db, "utilisateur"),where("username" , "==" , email), where ("password" , "==" , password));

    
    const querySnapshot = await getDocs(q);
    
    

    if(querySnapshot.empty){
      /*
      setTimeout(
        function () {
          console.log("empty")
          setLoading(false)
          //setShowMsg(true)



          
        }
          .bind(this),
        3000
      );

      setTimeout(
        function () {
          setShowMsg(false)
          console.log("hiding msg")
        }
          .bind(this),
        5000
      );

      */

      //delete
      setShowDashboard(true)
      setTimeout(
        function () {
          navigate('/Dashboard', {
            state: {
              articleId: 5
            }
          });
        }
          .bind(this),
        4000
      );
    }else{
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        
        setTimeout(
          function () {
            console.log("user exist");
            console.log(doc.id, " => ", doc.data());
            setShowDashboard(true)
          }
            .bind(this),
          3000
        );

        

        setTimeout(
          function () {
            navigate('/Dashboard', {
              state: {
                articleId: 5
              }
            });
          }
            .bind(this),
          4000
        );
        
      });

    }

    /*
    try {
      const docRef = await addDoc(collection(db, "utilisateur"), {
        username: email,
        password : password
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    */


    
  };


  return(


  <motion.div 
  className="home-page"
  initial={{scale:1 , opacity : 1}}
      animate={!showDashboard ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 0}}
  >

      

      <div className="black-overlay">

      </div>
      <div className="header">
        <div className="logo-container">
          <p>Korsaa</p>
        </div>
      </div>

      <div className="login-form">

        <img src={logo} alt="" />
        <p className="small-text">Wellcome Again</p>
        <h2>LOGIN</h2>
        <p className="small-text" >Veuillez vous athentifier pour acceder a votre espace Admin</p>
        <form onSubmit={HandleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group ">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Votre Mot De Passe"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="msg-container">
            <motion.p initial={{ scale: 0, opacity: 0 }} animate={!showMsg ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1}} >Corrdoné erroné, Veuillez réessayer</motion.p>
          </div>
          <div className="action-group">
            <div className="btn-container">
              <p>Mot de passe Oublie ?</p>
            </div>
            <div className="btn-container"
                  onClick={(event)=> {
                    HandleLogin(event);
                  }}
            >
              <motion.p initial={{ scale: 1, opacity: 1 }} animate={loading ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1}} >Se Connecter</motion.p>
              <motion.img className="loading" initial={{ scale: 1, opacity: 1 }} animate={!loading ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }} src={loadingIcon}/>

            </div>
          </div>
        </form>
      </div>


      
      <div className="colored-back"></div>
      <div className="colored-back2"></div>
  </motion.div>

  
  );

}

export default Home;
