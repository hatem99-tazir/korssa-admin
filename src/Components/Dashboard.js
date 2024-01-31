
import "../styles/dashboard.css"

import { motion } from "framer-motion"

import { Outlet, Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import loadingIcon from "../asstes/loadingIconBlue.gif"
import { useLocation } from "react-router-dom";

import home from "../asstes/dashboard/home.png"
import notification from "../asstes/dashboard/notification.png"
import request from "../asstes/dashboard/request.png"
import livreur from "../asstes/dashboard/livreur.png"
import logout from "../asstes/dashboard/logout.png"
import client from "../asstes/dashboard/client.png"
import order from "../asstes/dashboard/order.png"


import logo from "../asstes/logo.png"



import emailjs from '@emailjs/browser';


import CancelDetailOverlay from "../Components/CancelDetailOverlay"

import DismissDetailOverlay from "../Components/DismissDetailOverlay"

import TransporterForm from "../Components/transporter_form"

import OrderDetails from "../Components/orderDetails"

import SelectTranspConf from "../Components/selectTranspConf"

import TranspDetails from "../Components/TranspDetails"

import ClientDetails from "../Components/ClientDetails"

import OrderPage from "../Components/orders-page"

import { getDatabase, ref, set, push, get, update } from "firebase/database";
import TransporterPage from "./TransportersPage";
import ClientPage from "./clinetPage";
import StatPage from "./statPage";
import DelivredOverlay from "./DelivredOverlay";

import TranspPapers from "./TranspPapers";

function Dasboard() {
    const [page1, setPage1] = useState(false);
    const [page2, setPage2] = useState(false);
    const [page3, setPage3] = useState(false);
    const [page4, setPage4] = useState(false);
    const [page5, setPage5] = useState(false);
    const [page6, setPage6] = useState(false);

    const [loading, setLoading] = useState(true);

    const [showTransporterInfos, setShowTransporterInfos] = useState(false);

    const [showOrdersOverlay, setShowOrdersOverlay] = useState(false);


    const [showNewTransoprterOverlay, setShowNewTransoprterOverlay] = useState(false);

    const [showSelectOption1, setShowSelect1 ] = useState(false);
    const [showSelectOption2, setShowSelect2] = useState(false);


    const [allOrders, setAllOrders] = useState([]);
    const [filterOrders, setFilterOrders] = useState([]);
    const [presOrders, setPresOrders] = useState([]);
    


    const [choiceTransoporter, setChoiceTransoporter] = useState([]);

    const [allClient, setAllClient] = useState([]);
    

    const [allTransporters, setAllTransporters] = useState([]);




    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedTransp, setSelectedTransp] = useState(null);

    
    const [showtranspPapers, setShowtranspPapers] = useState(false);


    const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState(null);
    
    const [showCancelDetailOverlay, setShowCancelDetailOverlay] = useState(false);

    const [showDelivredOverlay, setShowDelivredOverlay] = useState(false);    
    
    const [showDismissDetailOverlay, setShowDismissDetailOverlay] = useState(false);



    //stats 


    //end stats

   


    //transporter 
    const [showTranspDetails, setShowTranspDetails] = useState(false);
    const [selectedTranspDetail, setSelectedTranspDetail] = useState(null);
    
    const [mountTranspDetails, setMountTranspDetails] = useState(false);
    //transporter end

    //client 
    const [showClientDetails, setShowClinetDetails] = useState(false);
    const [selectedClientDetail, setSelectedClientDetail] = useState(null);

    const [mountClientDetails, setMountClientDetails] = useState(false);


    //updateView


    
    const [updateOrderView, setUpdateOrderView] = useState(false);

    
    const [updateTranspView, setUpdateTranspView] = useState(false);



    

    const navigate = useNavigate();
    const location = useLocation();
    
    const [showLogOutOverlay, setShowLogOutOverlay] = useState(false);

    const logoutHandler = ()=> {
        navigate('/');
    }
    


    //client end

    //confimration pop ups
    const [selectTranspOverlay, setSelectTranspOverlay] = useState(false);

    const formatDate = (date)=> {

        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        var res = dd + '/' + mm + '/' + yyyy;
        return res;
    }

    const selectOrderTransoprter = (item) => {
        setSelectedTransp(item)
        console.log(selectedOrder)
        console.log(item)
    }


    async function confirmOrder(order, transporterID) {
        let shipmentID = order.id;

        console.log(selectedTransp.email);

        var client = await getClientById(selectedOrder.client_id);

        console.log(client[1])

        const db = getDatabase();

        const data = {
            transporter_id: transporterID,
            time_confirmed: formatDate(new Date()),
            state : "c"
        };

        const id = ref(db, 'Shipment/' + shipmentID);


        emailjs.init("h0ccV5CndNZXi2MXt");

                var transporter_params = {
                    email_content : "You have been tasked with the delivery of Shipment #".concat(shipmentID).concat(".\n From: \"".concat(selectedOrder.from).concat("\" To: \"").concat(selectedOrder.to).concat("\".\n").concat(" Client's Telephone Number: ".concat(client[1].phone))),
                    recipient_email : selectedTransp.email,
                    recipient_name : selectedTransp.name,
                    recipient_phone : selectedTransp.phone
                }

                console.log(transporter_params);
            
                emailjs.send("service_b6v0zjq","template_6lq2fnq",transporter_params);

                var client_params = {
                    email_content : "Your delivery has been confirmed by ".concat(selectedTransp.name).concat(".\n From: \"".concat(selectedOrder.from).concat("\" To: \"").concat(selectedOrder.to).concat("\".\n").concat(" Transporter's Telephone Number: ".concat(selectedTransp.phone))),
                    recipient_email : client[1].email,
                    recipient_name : client[1].name,
                    recipient_phone : client[1].tel_number,
                }

                console.log(client_params);

                emailjs.send("service_b6v0zjq","template_6lq2fnq",client_params);

            
        try {
            await update(id, data);
            order.setInf({state: 'c', transporter_id: transporterID}, filterOrders, allOrders, presOrders)
        }catch(x) {
            console.log(x);
        }

    }

    async function dismissOrder(order) {
        let shipmentID = order.id;

        const db = getDatabase();

        const data = {
            time_dismissed: formatDate(new Date()),
            state : "oos"
        };

        const id = ref(db, 'Shipment/' + shipmentID);

        try {
            await update(id, data);
            order.setInf({state: 'oos'}, filterOrders, allOrders, presOrders)
        }catch(x) {
            console.log(x);
        }

    }

    async function cancelOrder(order) {
        let shipmentID = order.id;

        const db = getDatabase();

        const data = {
            time_canceled: formatDate(new Date()),
            state : "cn"
        };

        const id = ref(db, 'Shipment/' + shipmentID);

        console.log("cancelling order " + shipmentID);
        try {
            await update(id, data);
            order.setInf({state:'cn'}, filterOrders, allOrders, presOrders);
        }catch(x) {//ignore
            console.log(x);
        }

    }


    
    async function deliverOrder(order) {
        let shipmentID = order.id;
        const db = getDatabase();

        const data = {
            time_delivered: formatDate(new Date()),
            state : "d"
        };

        const id = ref(db, 'Shipment/' + shipmentID);



        try {
            await update(id, data);
            order.setInf({state:'d'}, filterOrders, allOrders, presOrders);
        }catch(x) {//ignore
            console.log(x);
        }



    }


    const getClientById = async (id)=> {
       

        const db = getDatabase();
        const shipments = ref(db, 'Client');
        let ss = await get(shipments);
        
        const data = ss.val();
        const list = Object.entries(data)
        for(let i = 0; i < list.length; i++) {
            let element = list[i];
            if (element[0] == id) {
                console.log(element)
                return element;
            }
        }

        return "cc";
    }


    const getAllTransporter = () => {

        const db = getDatabase();
        const shipments = ref(db, 'Transporter');

        get(shipments)
            .then((snapshot) => {
                const data = snapshot.val();
                const list = Object.entries(data)
                console.log(list)
                var transps = [];
                list.forEach(element => {
                    console.log("agent exsist")
                    transps.push({ id: element[0], name: element[1].name, city: element[1].city, location: element[1].location, email: element[1].email, payment_method: element[1].payment_method, phone: element[1].phone, state: element[1].status, vehicle_type: element[1].vehicle , date: "12/12/2023" })
                    console.log(element[1].name)

                });

                setAllTransporters(transps)
                setChoiceTransoporter(transps)
            })
    }



    const getAllClient = () => {

        const db = getDatabase();
        const shipments = ref(db, 'Client');

        get(shipments)
            .then((snapshot) => {
                const data = snapshot.val();
                const list = Object.entries(data)
                var clients = [];
                var index = 1;
                list.forEach(element => {
                    console.log("client exsist")
                    clients.push({ id: element[0], name: element[1].name, business_nature: element[1].business_nature, company_name: element[1].company_name, location: element[1].location, signup_date: element[1].signup_date, tel_number: element[1].tel_number, status: element[1].status })
                    index++;

                });

                setAllClient(clients)
            })
    }





    useEffect(() => {


        window.addEventListener('click', function (e) {
            if (document.getElementById('select-option') != null && !document.getElementById('select-option').contains(e.target)) {
                    setShowSelect1(false)
                
            }

            if (document.getElementById('select-option2') != null && !document.getElementById('select-option2').contains(e.target)) {
                setShowSelect2(false)

            }

            if (showNewTransoprterOverlay && !document.getElementById('transporter-details').contains(e.target)) {
                //setShowNewTransoprterOverlay(false)

            }
            

            

            
                
        });

        getAllClient()
        getAllTransporter()
        setTimeout(()=> {
            setPage1(true);
            setLoading(false)
        } , 5000)
    }, []);


    return (
        <motion.div 
        className="dashboard-page"
        initial={{opacity : 0}}
        animate={{opacity : 1 , transition:{delay : 2}}}
        >

            <motion.div 
            className="loading-icon"
            initial={{ opacity: 0 }}
                animate={loading ? { opacity: 1, transition: { delay: 2 } } : { opacity: 0}}
            
            >
                <motion.img src={loadingIcon} alt="" className="loading-icon" />
                <p>Loading your Dashboard</p>
            </motion.div>

            <div className="dashboard-container">
                <div className="side-nav">
                    <div className="nav-item"
                        onClick={() => {
                            setPage6(true)
                        }}
                    >

                        <motion.div
                            className="notification-overlay"
                            initial={{ scale: 0 }}
                            animate={page6 ? { scale: 1, origin:"left",  transition: { ease: "easeInOut" } } : { scale: 0 }}
                        >

                        </motion.div>
                        <img src={notification} alt="" />
                        <motion.div
                            className="selected-background"
                            initial={{ scale: 0 }}
                            animate={page6 ? { scale: 1, transition: { ease: "easeInOut" } } : { scale: 0 }}
                        >

                        </motion.div>
                    </div>
                    <div className="hr"></div>
                    <motion.div 
                    className="nav-item selected"
                    onClick={()=> {
                        setPage1(true)
                        setPage2(false)
                        setPage3(false)
                        setPage4(false)
                        setPage5(false)
                        setPage6(false)

                    }}
                    >
                        <motion.div
                            className="selected-background"
                            initial={{ scale: 0 }}
                            animate={page1 ? { scale: 1, transition: { ease: "easeInOut" } } : { scale: 0 }}
                        >

                        </motion.div>

                        <img src={home} alt="" />
                    </motion.div>
                    <motion.div 
                    className="nav-item"
                        onClick={() => {
                            setPage2(true)
                            setPage1(false)
                            setPage3(false)
                            setPage4(false)
                            setPage5(false)
                            setPage6(false)

                        }}
                    >
                        <img src={order} alt="" />

                        <motion.div 
                        className="selected-background"
                            initial={{ scale:0 }}
                            animate={page2 ? { scale:1 , transition:{ease:"easeInOut"}} : { scale:0}}
                        >

                        </motion.div>
                    </motion.div>
                    <div className="nav-item"
                        onClick={() => {
                            setPage1(false)
                            setPage2(false)
                            setPage3(true)
                            setPage4(false)
                            setPage5(false)
                            setPage6(false)

                            //document.getElementById("page1").style.zIndex = 1;
                        }}
                    >
                        <img src={livreur} alt="" />
                        <motion.div
                            className="selected-background"
                            initial={{ scale: 0 }}
                            animate={page3 ? { scale: 1, transition: { ease: "easeInOut" } } : { scale: 0 }}
                        >

                        </motion.div>
                    </div>
                    <div className="nav-item"
                        onClick={() => {
                            setPage1(false)
                            setPage2(false)
                            setPage3(false)
                            setPage4(true)
                            setPage5(false)
                            setPage6(false)
                        }}
                    >
                        <img src={client} alt="" />
                        <motion.div
                            className="selected-background"
                            initial={{ scale: 0 }}
                            animate={page4 ? { scale: 1, transition: { ease: "easeInOut" } } : { scale: 0 }}
                        >

                        </motion.div>
                    </div>
                     <div className="nav-item"
                        onClick={() => {
                            setPage1(false)
                            setPage2(false)
                            setPage3(false)
                            setPage4(false)
                            setPage5(true)
                            setPage6(false)
                        }}
                     >
                        <img src={request} alt="" />
                        <motion.div
                            className="selected-background"
                            initial={{ scale: 0 }}
                            animate={page5 ? { scale: 1, transition: { ease: "easeInOut" } } : { scale: 0 }}
                        >

                        </motion.div>
                     </div>

                    <div className="nav-item last-nav-item" onClick={()=> {
                        setShowLogOutOverlay(true);
                    }}>

                        <img src={logout} alt="" />
                        <motion.div
                            className="selected-background"
                            initial={{ scale: 0 }}
                            >

                        </motion.div>
                    </div>
                </div>







                <div className="dashboard-pages-container">


                    
                    
                    {
                        page1 ?
                            <StatPage setShowClinetDetails={setShowClinetDetails}  setSelectedClientDetail={setSelectedClientDetail}  setShowOrdersOverlay={setShowOrdersOverlay}  anime={page1} selectOrderTransoprter={selectOrderTransoprter} selectedOrderToUpdate={selectedOrderToUpdate} setSelectTranspOverlay={setSelectTranspOverlay} />
                            :
                            null
                    }
                    {
                        page2 ? 
                            <OrderPage setShowDelivredOverlay={setShowDelivredOverlay} showTranspDetails={showTranspDetails} setShowTranspDetails={setShowTranspDetails} updateOrderView={updateOrderView} setUpdateOrderView={setUpdateOrderView} setShowDismissDetailOverlay={setShowDismissDetailOverlay} setShowCancelDetailOverlay={setShowCancelDetailOverlay} setSelectedOrder={setSelectedOrder} choiceTransoporter={choiceTransoporter} setChoiceTransoporter={setChoiceTransoporter} setShowTransporterInfos={setShowTransporterInfos} setShowOrdersOverlay={setShowOrdersOverlay}  showTransporterInfos={showTransporterInfos} anime={page2} selectOrderTransoprter={selectOrderTransoprter} selectedOrderToUpdate={selectedOrderToUpdate} setSelectTranspOverlay={setSelectTranspOverlay} selectedTranspDetail={selectedTranspDetail} setSelectedTranspDetail={setSelectedTranspDetail} setPropFilter={setFilterOrders} setPropAll={setAllOrders} setPropPres={setPresOrders}/>
                        :
                        null
                    }

                    {
                        page3 ?
                            <TransporterPage updateView={updateTranspView} setUpdateView={setUpdateTranspView} setShowNewTransoprterOverlay={setShowNewTransoprterOverlay} setSelectedTranspDetail={setSelectedTranspDetail} setShowTranspDetails={setShowTranspDetails} choiceTransoporter={choiceTransoporter} setChoiceTransoporter={setChoiceTransoporter} setShowTransporterInfos={setShowTransporterInfos} setShowOrdersOverlay={setShowOrdersOverlay}  anime={page3} selectOrderTransoprter={selectOrderTransoprter} selectedOrderToUpdate={selectedOrderToUpdate} setSelectTranspOverlay={setSelectTranspOverlay} />
                            :
                            null
                    }

                    {
                        page4 ?
                            <ClientPage setShowClinetDetails={setShowClinetDetails}  setSelectedClientDetail={setSelectedClientDetail}  setShowOrdersOverlay={setShowOrdersOverlay}  anime={page4} selectOrderTransoprter={selectOrderTransoprter} selectedOrderToUpdate={selectedOrderToUpdate} setSelectTranspOverlay={setSelectTranspOverlay} />
                            :
                            null
                    }

                    






                    <motion.div className="dashboard-orders"
                        initial={{ opacity: 0 }}
                        animate={page5 ? { opacity: 1 } : { opacity: 0 }}
                    >

                        <p>Registration Request Page Comming Soon...</p>
                        <img src={loadingIcon} alt="" />
                    </motion.div>


                    
                </div>
            </div>

            <motion.div className="dashboard-resposnive"
            
            >

                <img src={logo} alt="" />
                <p>Korsaa Admin Panel Is Available Only On Bigger Screens !</p>
            </motion.div>

            {
                showOrdersOverlay ?
                <motion.div className="order-details-overlay"
                initial={{ scale: 0, opacity: 0, display: "none" }}
                animate={showOrdersOverlay ? { scale: 1, display: "flex", opacity: 1 } : { scale: 0.5, opacity: 0 , transition:{ease:"easeInOut"}}}
                exit={{ display: "none"}}
                
            >
                <div className="order-details-container ">
                    <OrderDetails close={setShowOrdersOverlay} order={selectedOrder} setShowTranspDetails={setShowTranspDetails} setSelectedTranspDetail={setSelectedTranspDetail}></OrderDetails>
                </div>
            </motion.div>
        :
        null    
        }


            <motion.div className="transporter-details-overlay" 
                initial={{ scale: 0, opacity: 0, display: "none" }}
                animate={showNewTransoprterOverlay ? { scale: 1, display: "flex", opacity: 1 } : { scale: 0.5, opacity: 0, transition: { ease: "easeInOut" } }}
                exit={{ display: "none" }}
                onClick={(event) => {
                    event.preventDefault();
                }}
            >
                <div className="transporter-details-container" id="transporter-details"
                    onClick={(event) => {
                        event.preventDefault();
                    }}
                >

                    <TransporterForm setUpdateTranspView={setUpdateTranspView} list={allTransporters} close={() => setShowNewTransoprterOverlay(false)} update={() =>getAllTransporter()}></TransporterForm>
                </div>
            </motion.div>

            {
                selectedTranspDetail != null && showTranspDetails?
                <TranspDetails setShowtranspPapers={setShowtranspPapers} setShowOrdersOverlay={setShowOrdersOverlay} setSelectedOrder={setSelectedOrder}  transp={selectedTranspDetail} visible={showTranspDetails} close={() => {setShowTranspDetails(false) ; setMountTranspDetails(false)}} />
                :
                null
            }
            
            {
                selectedClientDetail != null && showClientDetails?
                    <ClientDetails setShowOrdersOverlay={setShowOrdersOverlay} setSelectedOrder={setSelectedOrder} client={selectedClientDetail} visible={showClientDetails} close={() => { setShowClinetDetails(false); setMountClientDetails(false)}} />
                :
                null
            }

{
                showtranspPapers ?
                    <TranspPapers setShowOrdersOverlay={setShowOrdersOverlay} setSelectedOrder={setSelectedOrder} transp={selectedTranspDetail} visible={showtranspPapers} close={() => { setShowtranspPapers(false); setMountClientDetails(false)}} />
                :
                null
            }

                {
                showCancelDetailOverlay?
                    <CancelDetailOverlay order={selectedOrder} anime={showCancelDetailOverlay} close={() => { setShowCancelDetailOverlay(false); }}  cancelOrder={cancelOrder} />
                :
                null
            }

{
                showDismissDetailOverlay?
                    <DismissDetailOverlay order={selectedOrder} anime={showDismissDetailOverlay} close={() => { setShowDismissDetailOverlay(false); }}  dismissOrder={dismissOrder} />
                :
                null
            }

{
                showDelivredOverlay?
                    <DelivredOverlay order={selectedOrder} anime={showDelivredOverlay} close={() => { setShowDelivredOverlay(false); }}  cancelOrder={deliverOrder} />
                :
                null
            }

            
<motion.div 
                className="select-transporter-overlay overlay max-width max-height flex-column bold align-center justify-center confirme-overlay"
                initial={{ opacity: 0 , display: "none"}}
                animate={showLogOutOverlay ? { opacity: 1, display: "flex" } : { opacity: 0 }}
            >

                <div 
                id="logout-conf"
                className="logout-conf white-back flex flex-column align-center justify-center">
                    <p>Do you want to logout ?</p>

                        <div className="logout-actions flex bold align-center justify-center margin-top20">
                        <div className="btn flex orange-back align-center justify-center"
                        onClick={()=> {
                            logoutHandler()
                        }}
                        
                        >Yes</div>
                        <div className="btn flex  align-center justify-center cancel-action"
                            onClick={() => {
                                setShowLogOutOverlay(false)
                            }}
                        >Cancel</div>
                    </div>
                </div>
            </motion.div>
            
            
            <SelectTranspConf selectTranspOverlay={selectTranspOverlay} setSelectTranspOverlay={setSelectTranspOverlay} transp={selectedTransp} order={selectedOrder} confirmOrder={confirmOrder} />
        </motion.div>
    );
}

export default Dasboard;