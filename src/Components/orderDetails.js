import "../styles/orderDetails.css"

import { motion } from "framer-motion"
import client from "../asstes/dashboard/client.png"

import React, { useState, useEffect } from 'react';

import exit from "../asstes/dashboard/exit.png"

import { getDatabase, ref, set, push, get } from "firebase/database";



function OrderDetails({order , close }) {



    const [transp , setTransp] = useState(null);
    
    const [transDetailShown , setTransDetailShown] = useState(false);
    
    const getOrderTransporter = async ()=> {


            const db = getDatabase();
            const shipments = ref(db, 'Transporter');
            let ss = await get(shipments);
    
            const data = ss.val();
            const list = Object.entries(data)
            for (let i = 0; i < list.length; i++) {
                let element = list[i];


                if (element[0] == order.transporter_id) {

                    setTransp({ id: element[0], name: element[1].name, city: element[1].city, location: element[1].location, email: element[1].email, payment_method: element[1].payment_method, phone: element[1].phone, state: element[1].status, vehicle_type: element[1].vehicle, date: "12/12/2023" })
                    
                    return element;
                }
            }
    
            return "cc";
        
    }


    useEffect(() => {

        console.log(order)
        getOrderTransporter();

        

    })

    return (
        order != null ?
        <motion.div
            className="orders-details"
            id="orders-details"
            initial={{ opacity: 0 }}
            animate={transDetailShown ? { opacity: 1, transition: { delay: 2 } , zIndex:6 } : { opacity: 1, transition: { delay: 2 }, zIndex : 4 }}
        >

                <div className="close-btn"
                    onClick={()=> {
                        close(false)
                    }}
                >
                    
                    <img src={exit} alt="" />
                    </div>
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
                        <div  className={order.state === "w" ? "stat-circle bkYellow" :order.state === "c" ? "stat-circle bkBlue" :order.state === "d"? "stat-circle bkgreen" : "stat-circle bkred"} >
                            <p>{order.state}</p>
                        </div>
                    </motion.p>
                    {
                        order.state === "w" ?
                    <p className="big-text">Waiting</p>
                    :
                    order.state === "c" ?
                    <p className="big-text">Confirmed</p>
                    :

                    order.state === "d" ?
                    <p className="big-text">Delivred</p>
                    :
                    <p className="big-text">Canceled</p>
                    
                    }

                    {
                         order.state === "w" ?
                         null
                         :
                         <div>
                            <p>Transporter</p>
                            <div className="btn">
                                <p>{transp!= null ? transp.name + "   ("+ transp.phone+")" : "ss"}  </p>
                                
                            </div>
                            
                        </div>
                    }


                </div>
                <div className="orders-infos">
                    <div className="order-info-img">
                        <img src={client} alt="" />
                    </div>
                    <p>Vehicle</p>
                    <div className="order-info-corps">
                        <p className="small-text">Korssa Client Xsc85</p>
                        <p>{order.vehicle_type}</p>
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