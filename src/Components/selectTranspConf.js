


import "../styles/dashboard.css"

import { motion } from "framer-motion"

import React, { useState, useEffect } from 'react';

import exit from "../asstes/dashboard/exit.png"

import { getDatabase, ref, set, push, get } from "firebase/database";



function SelectTranspConf({ selectTranspOverlay, setSelectTranspOverlay, order, transp, confirmOrder , updateView }) {

    return(

        transp != null && order != null ?
        <motion.div className="select-transporter-overlay"
            initial={{ scale: 0, opacity: 0, display: "none" }}
            animate={selectTranspOverlay ? { scale: 1, display: "flex", opacity: 1 } : { scale: 0.5, opacity: 0, transition: { ease: "easeInOut" } }}
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
                <p>Transoporter Confirmation</p>

                <p>Do want to set Transoprter <span>{transp.name} ({transp.city})</span> with phone number <span>{transp.phone}</span>, to the order <span>{order.id}</span>  of <span>{order.client}</span></p>

                <div className="conf-actions">
                    <div className="conf-action"
                        onClick={() => {
                            confirmOrder(order.id , transp.id);
                            setSelectTranspOverlay(false);
                            updateView();
                        }}
                    >
                        <p>Confirme</p>
                    </div>
                    <div className="conf-action"
                        onClick={() => {
                            setSelectTranspOverlay(false);
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

export default SelectTranspConf;