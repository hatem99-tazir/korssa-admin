import "../styles/TransporterForm.css"

import { motion } from "framer-motion"

import React, { useState, useEffect } from 'react';

import exit from "../asstes/dashboard/exit.png"

import { getDatabase, ref, set, push, get } from "firebase/database";



function TransporterForm({setUpdateTranspView, close , list , update}) {

    const wilayaNames = [
        "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Bechar", "Blida", "Bouira",
        "Tamanrasset", "Tbessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Se9tif", "Saefda",
        "Skikda", "Sidi Bel Abbes", "Annaba", "Guelma", "Constantine", "Medea", "Mostaganem", "M'Sila", "Mascara",
        "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt",
        "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent", "Ghardaefa",
        "Relizane", "El M'ghair", "El Menia", "Ouled Djellal", "Bordj Baji Mokhtar", "Béni Abbès", "Timimoun",
        "Touggourt", "Djanet", "In Salah", "In Guezzam"
      ];

      const payment_methods = ["Hand-To-Hand" , "Bill" , "Check" , "Bank Transfer"];
      const vehicle_types = ["Truck", "Fourgon", "Normal Car"]

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

        console.log("insert transp")
        setUpdateTranspView(true)
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
                    <input type="text" placeholder="Transporter's Name" value={transName}  
                    onChange={(e)=> {
                        setTransName(e.target.value);
                    }}/>
                </div>
                <div className="form-input">
                    <p>City</p>
                    

                <select id="wilayaDropdown" value={transCity}
                        onChange={(e) => {
                            setTransCity(e.target.value);
                        }} >
                        {wilayaNames.map((wilaya, index) => (
                        <option key={index} value={wilaya}>
                            {wilaya}
                        </option>
                        ))}
                </select>
                </div>
            </div>

            <div className="form-grp">
                <div className="form-input">
                    <p>Location</p>
                    <input type="text" placeholder="Transporter's Home Address" value={transLocation}
                        onChange={(e) => {
                             setTransLocation(e.target.value);
                        }} />
                </div>
                <div className="form-input">
                    <p>Phone</p>
                    <input type="text" placeholder="Transporter's Phone Number" value={transPhone}
                        onChange={(e) => {
                            setTransPhone(e.target.value);
                        }} />

                </div>
            </div>

            <div className="form-grp">
                <div className="form-input">
                    <p>Email</p>
                    <input type="text" placeholder="Transporter's Email Address" value={transEmail}
                        onChange={(e) => {
                            setTransEmail(e.target.value);
                        }} />

                </div>
                <div className="form-input">
                    <p>Payment Method</p>

                    <select value={transPayment}
                            onChange={(e) => {
                                setTransPayment(e.target.value);
                            }} >
                            {payment_methods.map((method, index) => (
                            <option key={index} value={method}>
                                {method}
                            </option>
                            ))}
                    </select>

                </div>
            </div>

            <div className="form-grp">
            <div className="form-input">
                    <p>Matricule</p>
                    <input type="text" placeholder="Transporter's Vehicle ID" value={matricule}
                        onChange={(e) => {
                            setMatricule(e.target.value);
                        }} />

                </div>
                
                <div className="form-input">
                    <p>Vehilce</p>

                    <select value={vehicle}
                            onChange={(e) => {
                                setVehicle(e.target.value);
                            }} >
                            {vehicle_types.map((vehicle, index) => (
                            <option key={index} value={vehicle}>
                                {vehicle}
                            </option>
                            ))}
                    </select>
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