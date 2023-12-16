import "../styles/TransporterForm.css"

import { motion } from "framer-motion"

import React, { useState, useEffect } from 'react';

import exit from "../asstes/dashboard/exit.png"

import { getDatabase, ref, set, push, get } from "firebase/database";



function TransporterForm({close , list , update}) {

   
    const [transName, setTransName] = useState("");
    const [transCity, setTransCity] = useState("");
    const [transLocation, setTransLocation] = useState("");
    const [transPayment, setTransPayment] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [transEmail, setTransEmail] = useState("");
    const [transPhone, setTransPhone] = useState("");
    const [matricule, setMatricule] = useState("");


    const clear = ()=> {
        setTransName("");
        setTransCity("");
        setTransLocation("");
        setTransPayment("");
        setVehicle("");
        setTransEmail("");
        setTransPhone("");
        setMatricule("");
    }


    const submit = ()=> {
        const db = getDatabase();
        push(ref(db, 'Transporter'), {
            name: transName,
            location: transLocation,
            city: transCity,
            phone: transPhone,
            email: transEmail,
            payment_method: transPayment,
            vehicle: vehicle,
            signup_date: new Date().getTime(),
            status: false
        });

        update()
        clear();
    }


    return (
        <motion.div
            className="transporter-Form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 2 } }}
        >

            <div className="exit-btn" 
                onClick={()=> {
                    close()
                }}
            >
                <img src={exit} alt="" />
            </div>
            <p>New Transporter</p>

            <div className="form-grp">
                <div className="form-input">
                    <p>Name</p>
                    <input type="text" placeholder="Transoprter's First Name" value={transName}  
                    onChange={(e)=> {
                        setTransName(e.target.value);
                    }}/>
                </div>
                <div className="form-input">
                    <p>City</p>
                    <input type="text" placeholder="Transoprter's Last Name" value={transCity}
                        onChange={(e) => {
                            setTransCity(e.target.value);
                        }} />
                </div>
            </div>

            <div className="form-grp">
                <div className="form-input">
                    <p>Location</p>
                    <input type="text" placeholder="Transoprter's Phone Number" value={transLocation}
                        onChange={(e) => {
                            setTransLocation(e.target.value);
                        }} />

                </div>
                <div className="form-input">
                    <p>Phone</p>
                    <input type="text" placeholder="Transoprter's Business Nature" value={transPhone}
                        onChange={(e) => {
                            setTransPhone(e.target.value);
                        }} />

                </div>
            </div>

            <div className="form-grp">
                <div className="form-input">
                    <p>Email</p>
                    <input type="text" placeholder="Transoprter's Company Name" value={transEmail}
                        onChange={(e) => {
                            setTransEmail(e.target.value);
                        }} />

                </div>
                <div className="form-input">
                    <p>Payment Method</p>
                    <input type="text" placeholder="Transoprter's Payment Method" value={transPayment}
                        onChange={(e) => {
                            setTransPayment(e.target.value);
                        }} />

                </div>
            </div>

            <div className="form-grp">
                <div className="form-input">
                    <p>Vehilce</p>
                    <input type="text" placeholder="Transoprter's Company Name" value={vehicle}
                        onChange={(e) => {
                            setVehicle(e.target.value);
                        }} />

                </div>
                <div className="form-input">
                    <p>Matricule</p>
                    <input type="text" placeholder="Transoprter's Payment Method" value={matricule}
                        onChange={(e) => {
                            setMatricule(e.target.value);
                        }} />

                </div>
            </div>

            <div className="form-actions">
                <div className="form-action bkBlue"
                    onClick={()=> {
                        submit()
                        close()
                    }}
                >
                    <p>Submit</p>
                </div>

                <div className="form-action second-action" 
                    onClick={()=> {
                        clear()
                    }}
                >
                    <p>Clear</p>
                </div>

               
                
            </div>
        </motion.div>
    );
}

export default TransporterForm;