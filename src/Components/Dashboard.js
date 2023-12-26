
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



import emailjs from '@emailjs/browser';


import CancelDetailOverlay from "../Components/CancelDetailOverlay"
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

function Dasboard() {

    const navigate = useNavigate();
    const location = useLocation();


    const [page1, setPage1] = useState(false);
    const [page2, setPage2] = useState(false);
    const [page3, setPage3] = useState(false);
    const [page4, setPage4] = useState(false);
    const [page5, setPage5] = useState(false);
    const [page6, setPage6] = useState(false);

    const [loading, setLoading] = useState(true);

    const [showOrderAction, setShowOrderAction] = useState(-1);
    const [showTransporterInfos, setShowTransporterInfos] = useState(false);

    const [showOrdersOverlay, setShowOrdersOverlay] = useState(false);


    const [showNewTransoprterOverlay, setShowNewTransoprterOverlay] = useState(false);

    const [showSelectOption1, setShowSelect1 ] = useState(false);
    const [showSelectOption2, setShowSelect2] = useState(false);


    const initSelected = [true, true, true, true, true, true, true, true];
    const [selectedField, setSelectedField] = useState(initSelected);


    
    const [presAllOrders, setPresAllOrders] = useState([]);

    const [choiceTransoporter, setChoiceTransoporter] = useState([]);
    


    const [allOrders, setAllOrders] = useState([]);
    const [filterOrders, setFilterOrders] = useState([]);

    const [allClient, setAllClient] = useState([]);
    const [filterClinet, setFilterClinet] = useState([]);
    

    const [allTransporters, setAllTransporters] = useState([]);
    const [filteTransporters, setFilterTransporters] = useState([]);




    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedTransp, setSelectedTransp] = useState(null);

    const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState(null);

    const [selectedDateAnim, setSelectedDateAnim] = useState(6);
    

    

    const [selectedStateFilter, setSelectedStateFilter] = useState(0);

    
    const [showCancelDetailOverlay, setShowCancelDetailOverlay] = useState(false);

    
    const [showDelivredOverlay, setShowDelivredOverlay] = useState(false);


    
    


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
    


    //client end

    //confimration pop ups
    const [selectTranspOverlay, setSelectTranspOverlay] = useState(false);



    const filterByState = (filter)=> {

        var filterRes = [];
        if(filter == "a") {
            setFilterOrders(allOrders);
        }else{

            allOrders.map((item)=> {
                if(item.state === filter) {
                    filterRes.push(item);
                }
            })

            setFilterOrders(filterRes);
        }
    }

    const filterByStatus = (filter) => {

        var filterRes = [];
        if (filter == "a") {
            setFilterTransporters(allTransporters);
        } else {

            allTransporters.map((item) => {
                if (item.state === filter) {
                    filterRes.push(item);
                }
            })

            setFilterTransporters(filterRes);
        }
    }


    const getPrevDate = (i)=> {
        var date = new Date();
        date.setDate(date.getDate() - i);
        var res = { day: date.toString().split(" ")[0],date: date.toString().split(" ")[2] };
        return res;
    }

    const formatDate = (date)=> {

        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        var res = dd + '/' + mm + '/' + yyyy;
        return res;
    } 
    //sort 

    function compare(a, b) {
        if (a.price < b.price) {
            console.log("cc")
            return 1;
        }
        if (a.price > b.price) {
            return -1;
        }
        return 0;
    }

    function compareName(a, b) {
        console.log("compareName")
        if (a.client < b.client) {
            console.log("cc")
            return -1;
        }
        if (a.client > b.client) {
            console.log("cc")
            return 1;
        }
        return 0;
    }

    const sortBy = (list , prop)=>{
        var res = [];
        if(list === "orders"){
            console.log("sort by")
            if(prop === "name"){
                res = filterOrders;
                res.sort(compareName)
                console.log("name")
                setFilterOrders(res);
            }else{

                res = filterOrders; 
                res.sort(compare)
                console.log("price")
                setFilterOrders(res);
            }
        }else{
            if(list === "clients"){

            }else {

            }
        }

    }


    const filterTransoprterOnSelect = (payment, from )=> {
        console.log(payment + " " + from)

        var res = []
        allTransporters.map((item) => {
            if(item.payment_method == payment && item.city == from) {
                res.push(item)
            }
        })

        setChoiceTransoporter(res);
    }

    const selectOrderTransoprter = (item) => {
        setSelectedTransp(item)
        console.log(selectedOrder)
        console.log(item)
    }


    async function confirmOrder(shipmentID, transporterID) {


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
            
                emailjs.send("service_sv5l70m","template_6lq2fnq",transporter_params);

                var client_params = {
                    email_content : "Your delivery has been confirmed by ".concat(selectedTransp.name).concat(".\n From: \"".concat(selectedOrder.from).concat("\" To: \"").concat(selectedOrder.to).concat("\".\n").concat(" Transporter's Telephone Number: ".concat(selectedTransp.phone))),
                    recipient_email : client[1].email,
                    recipient_name : client[1].name,
                    recipient_phone : client[1].tel_number,
                }

                console.log(client_params);

                emailjs.send("service_sv5l70m","template_6lq2fnq",client_params);

        return update(id, data);

    }

    function cancelOrder(shipmentID) {

        const db = getDatabase();

        const data = {
            time_canceled: formatDate(new Date()),
            state : "cn"
        };

        const id = ref(db, 'Shipment/' + shipmentID);



        setUpdateOrderView(true)
        return update(id, data);

    }


    
    function deliverOrder(shipmentID) {

        const db = getDatabase();

        const data = {
            time_delivered: formatDate(new Date()),
            state : "d"
        };

        const id = ref(db, 'Shipment/' + shipmentID);



        setUpdateOrderView(true)
        return update(id, data);

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
    const getOrdersByDate = (date)=> {
        //must change : store all orders in a var
        
        console.log("getOrdersByDate.....")
        console.log(date)
        var res = [];
        presAllOrders.map((item)=> {
            console.log(item)
            if(item.date === date) {
                res.push(item)
            }
        })

        setAllOrders(res)
        setFilterOrders(res)




    }


    const getAllOrders =  () => {

        console.log("getting all orders...")
        const db = getDatabase();
        const shipments = ref(db, 'Shipment');

        get(shipments)
            .then((snapshot) => {
                const data = snapshot.val();
                const list = Object.entries(data)
                var clientorders = [];
                var index = 1;

                list.forEach(async element => {

                    var client = await getClientById(element[1].client_id);
                    console.log(client[1].name);

                    clientorders.push({ id: element[0], client: client[1].name, client_id: element[1].client_id, date: element[1].time_requested, from: element[1].charging_location, to: element[1].discharging_location, paiment: element[1].payment_method, price: element[1].price, state: element[1].state, weight: element[1].weight, vehicle_type: element[1].vehicle_type, description: element[1].description, size: element[1].size })
                    index++;
                   
                    
                });

                setAllOrders(clientorders)
                setPresAllOrders(clientorders)
            })
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

        getAllOrders()
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

                    <div className="nav-item last-nav-item">
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
                            <OrderPage setShowDelivredOverlay={setShowDelivredOverlay} showTranspDetails={showTranspDetails} setShowTranspDetails={setShowTranspDetails} updateOrderView={updateOrderView} setUpdateOrderView={setUpdateOrderView} setShowCancelDetailOverlay={setShowCancelDetailOverlay} setSelectedOrder={setSelectedOrder} choiceTransoporter={choiceTransoporter} setChoiceTransoporter={setChoiceTransoporter} setShowTransporterInfos={setShowTransporterInfos} setShowOrdersOverlay={setShowOrdersOverlay}  showTransporterInfos={showTransporterInfos} anime={page2} selectOrderTransoprter={selectOrderTransoprter} selectedOrderToUpdate={selectedOrderToUpdate} setSelectTranspOverlay={setSelectTranspOverlay} selectedTranspDetail={selectedTranspDetail} setSelectedTranspDetail={setSelectedTranspDetail}/>
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
                <TranspDetails setShowOrdersOverlay={setShowOrdersOverlay} setSelectedOrder={setSelectedOrder}  transp={selectedTranspDetail} visible={showTranspDetails} close={() => {setShowTranspDetails(false) ; setMountTranspDetails(false)}} />
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
                showCancelDetailOverlay?
                    <CancelDetailOverlay order={selectedOrder} anime={showCancelDetailOverlay} close={() => { setShowCancelDetailOverlay(false); }}  cancelOrder={cancelOrder} />
                :
                null
            }

{
                showDelivredOverlay?
                    <DelivredOverlay order={selectedOrder} anime={showDelivredOverlay} close={() => { setShowDelivredOverlay(false); }}  cancelOrder={deliverOrder} />
                :
                null
            }
            
            
            <SelectTranspConf selectTranspOverlay={selectTranspOverlay} setSelectTranspOverlay={setSelectTranspOverlay} transp={selectedTransp} order={selectedOrder} confirmOrder={confirmOrder} updateView={getAllOrders} />
        </motion.div>
    );
}

export default Dasboard;