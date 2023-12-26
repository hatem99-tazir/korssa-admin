


import "../styles/dashboard.css"

import { motion } from "framer-motion"

import React, { useState, useEffect } from 'react';

import exit from "../asstes/dashboard/exit.png"

import { getDatabase, ref, set, push, get } from "firebase/database";



function DelivredOverlay({ anime, order, close , cancelOrder }) {

    return(

        order != null ?
        <motion.div className="select-transporter-overlay"
            initial={{ scale: 0, opacity: 0, display: "none" }}
            animate={anime ? { scale: 1, display: "flex", opacity: 1 } : { scale: 0.5, opacity: 0, transition: { ease: "easeInOut" } }}
            exit={{ display: "none" }}
            onClick={(event) => {
                event.preventDefault();
            }}
        >
            <div className="select-transporter-container" id="select-transporter"
                onClick={(event) => {
                    event.preventDefault();
                }}
            >
                <p>Confirmation</p>
                
                <p>Do you want to set order  <span>{order.id}</span> as delivered ?</p>

                
                
                <div className="conf-actions">
                    <div className="conf-action"
                        onClick={() => {
                            
                        cancelOrder(order.id);
                        close()
                        }}
                    >
                        <p>Confirme</p>
                    </div>
                    <div className="conf-action"
                        onClick={() => {
                            close()
                        }}
                    >
                        <p>Cancel</p>
                    </div>
                </div>

            </div>
        </motion.div>

        :
        <div></div>
    )
}

export default DelivredOverlay;