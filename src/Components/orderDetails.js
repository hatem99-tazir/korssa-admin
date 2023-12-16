import "../styles/orderDetails.css"

import { motion } from "framer-motion"
import client from "../asstes/dashboard/client.png"

import React, { useState, useEffect } from 'react';



function OrderDetails({order}) {

    useEffect(() => {
        console.
        log("order details.....")
        console.log(order)
    })

    return (
        order != null ?
        <motion.div
            className="orders-details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 2 } }}
        >

            <div className="top-orders-details">
                <div className="orders-infos">
                    <p>Order {order.id}</p>
                    <p>Description :</p>
                    <p>{order.description}</p>
                </div>
                <div className="orders-infos">
                    <div className="order-info-header">
                        <div className="order-info-img">
                            <img src={client} alt="" />
                        </div>

                        <p>Client</p>
                    </div>

                    <div className="order-info-corps">
                        <p className="small-text">Korssa Client {order.client_id}</p>
                        <p>{order.client}</p>
                    </div>
                </div>
                <div className="orders-infos">
                    <div className="order-info-header">
                        <div className="order-info-img">
                            <img src={client} alt="" />
                        </div>

                        <p>Charging Location</p>
                    </div>

                    <div className="order-info-corps">
                        <p className="small-text">Korssa Client Xsc85</p>
                        <p>{order.from}</p>
                    </div>
                </div>
                <div className="orders-infos">
                    <div className="order-info-header">
                        <div className="order-info-img">
                            <img src={client} alt="" />
                        </div>

                        <p>Discharging Location</p>
                    </div>

                    <div className="order-info-corps">
                        <p className="small-text">Korssa Client Xsc85</p>
                        <p>{order.to}</p>
                    </div>
                </div>
                <div className="orders-infos">
                    <div className="order-info-header">
                        <div className="order-info-img">
                            <img src={client} alt="" />
                        </div>

                        <p>Price</p>
                    </div>

                    <div className="order-info-corps">
                        <p className="small-text">Korssa Client Xsc85</p>
                        <p>{order.price}</p>
                    </div>
                </div>

            </div>
            <div className="bottom-orders-details">
                <div className="orders-infos">
                    <p>Order State</p>

                    <motion.p className="state-container">
                        <div className="stat-circle bkYellow" >
                            <p>W</p>
                        </div>
                    </motion.p>

                    <p className="big-text">Waiting</p>
                    <div className="btn"
                    >
                        <p>Set Order State</p>
                    </div>
                </div>
                <div className="orders-infos">
                    <div className="order-info-img">
                        <img src={client} alt="" />
                    </div>
                    <p>Vehicle</p>
                    <div className="order-info-corps">
                        <p className="small-text">Korssa Client Xsc85</p>
                        <p>{order.vehicle}</p>
                    </div>
                </div>
                <div className="orders-infos">
                    <div className="order-info-img">
                        <img src={client} alt="" />
                    </div>
                    <p>Payment Method</p>
                    <div className="order-info-corps">
                        <p className="small-text">Korssa Client Xsc85</p>
                        <p>{order.paiment}</p>
                    </div>
                </div>
                <div className="orders-infos">
                    <div className="order-info-img">
                        <img src={client} alt="" />
                    </div>
                    <p>Size</p>
                    <div className="order-info-corps">
                        <p className="small-text">Korssa Client Xsc85</p>
                        <p>{order.size}</p>
                    </div>

                </div>
                <div className="orders-infos">
                    
                    <div className="order-info-img">
                        <img src={client} alt="" />
                    </div>
                    <p>weight</p>

                    <div className="order-info-corps">
                        <p className="small-text">Korssa Client Xsc85</p>
                        <p>{order.weight}</p>
                    </div>
                </div>
            </div>

            

            
        </motion.div>
        :
        <div></div>
    );
}

export default OrderDetails;