import "../styles/dashboard.css"

import { motion } from "framer-motion"

import React, { useState, useEffect } from 'react';

import exit from "../asstes/dashboard/exit.png"
import loadingIcon from "../asstes/loadingIconBlue.gif"
import { getDatabase, ref, set, push, get, update } from "firebase/database";
import { init } from "@emailjs/browser";



function TranspPapers({transp , visible , close , setShowOrdersOverlay , setSelectedOrder}) {


    const  [ initialValues , setInitialValues ] = {
        carte_grise: false,
        Assurance:  transp.Assurance,
        Vignette: transp.Vignette,
        Controle_technique: transp.Controle_technique,
        Permis_de_Circuler: transp.Permis_de_Circuler,
        Autorisation_transport_marchandises: transp.Autorisation_transport_marchandises,
        Autorisation_transport_produits_Dangereux: transp.Autorisation_transport_produits_Dangereux,
        Etiquettage: transp.Etiquettage,
        Assurance_marchandises: transp.Assurance_marchandises,
        registre_de_commerce: transp.registre_de_commerce,
        Carte_rouge: transp.Carte_rouge,
        Permis_de_conduire: transp.Permis_de_conduire,
      };

    const handleRadioChange = (e , index)=> {
        console.log(index)

        setInitialValues((prevValues) => {
            // Update values as needed
            return {
              ...prevValues,
              [index]: [e.target.value],
              // Add/update other values as needed
            };
          });
    }

    const [orders , setorders] = useState([]);
    const [loading, setloading] = useState(true);

    const getClientById = async (id) => {


        const db = getDatabase();
        const shipments = ref(db, 'Client');
        let ss = await get(shipments);

        const data = ss.val();
        const list = Object.entries(data)
        for (let i = 0; i < list.length; i++) {
            let element = list[i];
            if (element[0] == id) {
                return element;
            }
        }

        return "cc";
    }

    const getOrderByTransp = async (id) => {

        const db = getDatabase();
        const shipments = ref(db, 'Shipment');
        let ss = await get(shipments);

        const data = ss.val();
        const list = Object.entries(data)

        var res = [];
        for (let i = 0; i < list.length; i++) {
            let element = list[i];
            if (element[1].transporter_id == id) {
                var client = await getClientById(element[1].client_id);
                res.push({ id: element[0], client: client[1].name, client_id: element[1].client_id, date: element[1].time_requested, from: element[1].charging_location, to: element[1].discharging_location, paiment: element[1].payment_method, price: element[1].price, state: element[1].state, weight: element[1].weight, vehicle_type: element[1].vehicle_type, description: element[1].description, size: element[1].size })

            }
        }

        setorders(res);
        
    }

    
    useEffect(()=> {
        if (transp != null) {
            
        console.log("trans.............")
            getOrderByTransp(transp.id);
        }

        setTimeout(() => {
            setloading(false)
        }, 1000)
    } , [])

    return (

        transp != null ?
        <motion.div className="transporter-details-overlay "
            initial={{ scale: 0, opacity: 0, display: "none" }}
            animate={visible ? { scale: 1, display: "flex", opacity: 1 } : { scale: 0.5, opacity: 0, transition: { ease: "easeInOut" } }}
            exit={{ display: "none" }}
            onClick={(event) => {
                event.preventDefault();
            }}
        >


                <motion.div className="preloeader"
                    initial={{ opacity: 1 }}
                    animate={loading ? { opacity: 1 } : { opacity: 0 }}
                >
                    <img src={loadingIcon} alt="" />
                </motion.div>
            <motion.div className="transporter-details-container transpPapers-container" id="transporter-details"
                    initial={{ opacity: 0}}
                    animate={!loading ? { opacity: 1 } : { opacity: 0 }}
                
                onClick={(event) => {
                    event.preventDefault();
                }}
            >

                <div className="close-btn"
                    onClick={()=> {
                        close()
                    }}
                >
                    <img src={exit} alt="" />
                </div>


                <div className="transp-details-header">
                    <p>Korssa Legislation</p>
                    <p>{transp.name}</p>

                </div>

                <div className="leg-container">
                    
                    
                    {Object.keys(initialValues).map((option, index) => (
                        
                    <div key={index} className="leg-item">
                    <input
                        type="radio"
                        id={option}
                        value={initialValues[option]}
                        checked={initialValues[option]}
                        onChange={(e)=>handleRadioChange(e,option)}
                    />
                    <label htmlFor={option}>{option}</label>
                    </div>
                ))}
                    

                </div>

                
                

            </motion.div>
        </motion.div>

        :
        <div></div>
    )
}

export default TranspPapers;