/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import style from "./signupPage.module.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
// import {useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { BASE_API_URL } from "../../utils/Constants";

function SignupPage() {

  const [usercode, setUsercode] = useState();
  const [code, setCode] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  var ip;

  let history = useNavigate();

  function handleChange(e) {
    if (e.target.name == "email") setEmail(e.target.value);
    if (e.target.name == "password") setPassword(e.target.value);
    if (e.target.name == 'otp') setUsercode(e.target.value);
  }


  async function getip() {
    try{
        // var res= await axios.get("https://geolocation-db.com/json/");
        // ip=res.data; 
        
    }
    catch(err){
      console.log();
    }
    
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    // console.log(email, password);
    const obj = {
      email: email,
      password: password,
    };
    axios
      .post(`${BASE_API_URL}/signupPage`, obj)
      .then((res) => {
        if (res.data.message == "OTP") {
          swal({
            title: "Check Your Email To Verify OTP",
            icon: "info",
            button: "OK!",
          });
          document.getElementById("1").style.display = "none";
          document.getElementById("2").style.display = "block";
          // // console.log("Yehh chal gya")
          setCode(res.data.otp);
          // // console.log("Yehh")
        }
        else {
          swal({
            title: res.data.message,
            icon: "info",
            button: "OK!",
          });
        }
      })
      .catch((err) => {
        swal({
          text: "Error!: " + err,
          icon: "error",
        });
      });
  };

  async function handleVerify(e) {
    // // console.log("handleVerify me hun: ",code,usercode, email , password);
    e.preventDefault();
    await getip();

    axios.post(`${BASE_API_URL}/verify-otp`, { email: email, password: password, code: code, usercode: usercode, ip: ip })
      .then(res => {
        if (res.data.Isverify == true) {
          swal({
            title: "Registered!!",
            text: "Press OK to login!",
            icon: "success",
            button: "OK!"
          });
          history('/loginPage');
        }
        else {
          swal({
            text: "Wrong OTP Try Again",
            icon: "warning",
          });
        }
      })
  }
  function handleCross() {
    document.getElementById("2").style.display = "none";
    // document.getElementsById("1").style.display="none";
    document.getElementById("1").style.display = "block";
    // console.log("Cross clicked ")
  }

  return (
    <>
      <Navbar />
      <div className={style.main_block} id="1" >
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            className={style.forinput}
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            className={style.forinput}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <div className={style.btn_block}>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
          <div className={style.or}>Or</div>
          <div className={style.btn_block}>
            <Link to="/LoginPage">
              <button type="button" className="btn btn-secondary">
                Login
              </button>
            </Link>
          </div>
        </form>
      </div>

      <div className={style.bg_modal} id="2">
        <div
          className={style.close}
          onClick={() => {
            handleCross();
          }}
        >
          +
        </div>
        <form onSubmit={handleVerify}>
          <input
            className={style.forinputotp}
            type="number"
            name="otp"
            id="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
          />
          <div className={style.otp_btn_block}>
            <button type="submit">
              Verify
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

SignupPage.propTypes = {};

export default SignupPage;