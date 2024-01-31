


import "../styles/dashboard.css"

import { motion } from "framer-motion"

import React, { useState, useEffect } from 'react';

import exit from "../asstes/dashboard/exit.png"

import { getDatabase, ref, set, push, get } from "firebase/database";



function CancelDetailOverlay({ anime, order, close ,dismissOrder}) {

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
                
                <p>Are you sure you want to set this order <span>{order.id}</span> as out-of-service ?</p>
                
                <div className="conf-actions">
                    <div className="conf-action"
                        onClick={() => {
                            dismissOrder(order);
                            close()
                        }}
                    >
                        <p>Confirm</p>
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

export default CancelDetailOverlay;