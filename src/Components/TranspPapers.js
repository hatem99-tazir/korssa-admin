import "../styles/dashboard.css"

import { motion } from "framer-motion"

import React, { useState, useEffect } from 'react';

import exit from "../asstes/dashboard/exit.png"
import loadingIcon from "../asstes/loadingIconBlue.gif"
import { getDatabase, ref, set, push, get, update } from "firebase/database";
import { init } from "@emailjs/browser";


const updateLegistlation = async (initialValues, transp) => {

    const db = getDatabase();
            const data = {
                Carte_grise: initialValues.Carte_grise == true ? true : false,
                Assurance:  initialValues.Assurance == true ? true : false,
                Vignette: initialValues.Vignette == true ? true : false,
                Controle_technique: initialValues.Controle_technique == true ? true : false ,
                Permis_de_Circuler: initialValues.Permis_de_Circuler == true ? true : false,
                Autorisation_transport_marchandises: initialValues.Autorisation_transport_marchandises == true ? true : false,
                Autorisation_transport_produits_Dangereux: initialValues.Autorisation_transport_produits_Dangereux == true ? true : false,
                Etiquettage: initialValues.Etiquettage == true ? true : false,
                Assurance_marchandises: initialValues.Assurance_marchandises == true ? true : false,
                Registre_de_commerce: initialValues.Registre_de_commerce == true ? true : false,
                Carte_rouge: initialValues.Carte_rouge == true ? true : false,
                Permis_de_conduire: initialValues.Permis_de_conduire == true ? true : false,
            };

            transp.set(data);
    
        const id = ref(db, 'Transporter/' + transp.id);
        return update(id, data);
    
}

function TranspPapers({transp , visible , close , setShowOrdersOverlay , setSelectedOrder}) {
    console.log(transp);

    const  [ initialValues , setInitialValues ] = useState({
        Carte_grise: transp.Carte_grise,
        Assurance:  transp.Assurance,
        Vignette: transp.Vignette,
        Controle_technique: transp.Controle_technique,
        Permis_de_Circuler: transp.Permis_de_Circuler,
        Autorisation_transport_marchandises: transp.Autorisation_transport_marchandises,
        Autorisation_transport_produits_Dangereux: transp.Autorisation_transport_produits_Dangereux,
        Etiquettage: transp.Etiquettage,
        Assurance_marchandises: transp.Assurance_marchandises,
        Registre_de_commerce: transp.Registre_de_commerce,
        Carte_rouge: transp.Carte_rouge,
        Permis_de_conduire: transp.Permis_de_conduire,
      });

      let [valChange, setValChange] = useState(0);

      const handleLabelClick = (e, index) => {
        let newValues = {...initialValues};
        newValues[index] = !newValues[index];

        setInitialValues(newValues);

        setValChange((valChange + 1) % 3);
      }

      const handleRadioChange = (e , index) => {
        let newValues = {...initialValues};
        let v = e.target.checked;
        newValues[index] = v;

        setInitialValues(newValues);

        setValChange((valChange + 1) % 3);
      };

      useEffect(() => {
        setInitialValues(prevValues => ({ ...prevValues }));
      }, [valChange]);


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
                        
                    <div key={option} className="leg-item">
                    <input
                        type="checkbox"
                        id={option}

                        value={initialValues[option]}
                        
                        checked={initialValues[option]}
                        onChange={(e)=>handleRadioChange(e,option)}
                        
                    />
                    <label htmlFor={option} onClick={(e) => handleLabelClick(e, option)}>{option.replaceAll("_", " ")}</label>
                    </div>
                ))}
                    

                </div>


                <div className="transp-paper-actions">
                    <div className="transp-paper-btn"
                        onClick={()=> {
                            updateLegistlation(initialValues, transp);
                            close();
                        }}
                    >
                    
                        <p>Save</p>

                    </div>

                    <div className="transp-paper-btn"
                    onClick={()=> {
                        close()
                    }}
                    >
                        <p>Cancel</p>
                    </div>

                </div>
                

                
                

            </motion.div>
        </motion.div>

        :
        <div></div>
    )
}

export default TranspPapers;