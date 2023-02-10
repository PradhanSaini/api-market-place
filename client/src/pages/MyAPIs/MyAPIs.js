/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
// import BigTile from '../../components/BigTile/BigTile'
import axios from 'axios'
import MyCard from '../../components/MyCard/MyCard';
import style from './MyAPIs.module.scss'
import { BASE_API_URL } from '../../utils/Constants';
// import {useLocation} from 'react-router-dom';
// eslint-disable-next-line no-unused-vars

import {  useEffect } from 'react'
function MyAPIs() {
  
     const [myapi,setmyapi]= useState([]);

     useEffect(async ()=>{
       var head=await sessionStorage.getItem("accessToken")
       console.log("head",head)
       axios.post(`${BASE_API_URL}/my-all-api`, {header:head})
       .then((res) => {
        //  console.log(res.data[0].name);
         setmyapi(res.data);
        //  seaa
        // console
       });
     },[])     

  return <>
  <div>
      < Navbar />
      <div className={style.margindede}>
      <h3>Your uploaded APIs</h3>
      </div>
      <div className={style.parent}>
          {myapi.length>0 ? myapi.map((item,index) =>(
          <MyCard key ={index} endpoint= {item.endpoint} IsPublish ={item.IsPublish} email={item.email} name={item.name} image={item.url} description={item.desc}  id={item._id} className={style.child} />
        )): <div className={style.mid}>Your uploaded APIs will Appear here</div>}
        
      </div>
  </div>;
  </>
}

MyAPIs.propTypes = {};

export default MyAPIs;
