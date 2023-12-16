
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

import setting from "../asstes/dashboard/setting.png"
import arrow from "../asstes/dashboard/arrow.png"

import task from "../asstes/dashboard/task.png"

import actions from "../asstes/dashboard/actions.png"



import TransporterForm from "../Components/transporter_form"

import OrderDetails from "../Components/orderDetails"

import SelectTranspConf from "../Components/selectTranspConf"

import TranspDetails from "../Components/TranspDetails"

import ClientDetails from "../Components/ClientDetails"

import OrderPage from "../Components/orders-page"

import { getDatabase, ref, set, push, get, update } from "firebase/database";
import TransporterPage from "./TransportersPage";

function Dasboard() {

    const navigate = useNavigate();
    const location = useLocation();


    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

    //stats 

    const [lastMonthIncom, setLastMonthIncom] = useState(0);
    const [currentMonthIncom, setCurrentMonthIncom] = useState(0);

    const [clientCount, setClientCount] = useState(0);

    const [orderMonthCount, setOrderMonthCount] = useState(0);

    const [pendingOrders, setPendingorders] = useState(0);
    const [workerService, setWorkerService] = useState(0);

    const [satisfiedOrdersPercent, setSatisfiedOrdersPercent] = useState(0);
    

    const [workingCapacity, setWorkingCapacity] = useState(0);

    const [switchStatList, setSwitchStatList] = useState(0);
    

    const countWorkingCapacity = () => {

        const transporters = ref(getDatabase(), 'Transporter');

        get(transporters)
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("no data");
                }
                else {
                    const list = Object.entries(snapshot.val())
                    var result = new Array();

                    for (let index = 0; index < list.length; index++) {
                        if (list[index][1].status) {
                            result.push(list[index]);
                        }
                    }

                    setWorkingCapacity((result.length * 100) / list.length)
                    console.log("Workload at : " + (result.length * 100) / list.length + "%");
                }
            }).catch((error) => {
                console.error(error);
            });
    }
    const countOrdersSatisfiedPercent = () => {

        const shipments = ref(getDatabase(), 'Shipment');

        get(shipments)
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("no data");
                }
                else {
                    const list = Object.entries(snapshot.val());
                    var result = new Array();

                    for (let index = 0; index < list.length; index++) {
                        if (list[index][1].state != "w") {
                            result.push(list[index]);
                        }
                    }

                    setSatisfiedOrdersPercent((result.length * 100) / list.length)
                    console.log("Satisfied Orders : " + (result.length * 100) / list.length + "%");
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    
    const countWorkers = () => {

        const transporters = ref(getDatabase(), 'Transporter');

        get(transporters)
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("no data");
                }
                else {
                    const list = Object.entries(snapshot.val())
                    console.log("Transporter Count: " + list.length);
                    setWorkerService(list.length)
                }
            }).catch((error) => {
                console.error(error);
            });
    }
    const countOrdersPending = () => {

        const shipments = ref(getDatabase(), 'Shipment');

        get(shipments)
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("no data");
                }
                else {
                    const list = Object.entries(snapshot.val());
                    var result = new Array();

                    for (let index = 0; index < list.length; index++) {
                        if (list[index][1].state == "w") {
                            result.push(list[index]);
                        }
                    }

                    console.log("Pending Orders : " + result.length);
                    setPendingorders(result.length)
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    const countOrdersMonthly = (month, year) => {

        const shipments = ref(getDatabase(), 'Shipment');

        get(shipments)
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("no data");
                }
                else {
                    const list = Object.entries(snapshot.val());
                    var result = new Array();

                    for (let index = 0; index < list.length; index++) {
                        let shipmentMonth = list[index][1].time_requested.toString().split("/")[1];
                        let shipmentYear = list[index][1].time_requested.toString().split("/")[2];

                        if (shipmentMonth == month && shipmentYear == year) {
                            result.push(list[index]);
                        }
                    }

                    setOrderMonthCount(result.length)
                    console.log("Order Count in " + month + "/" + year + ": " + result.length);
                }
            }).catch((error) => {
                console.error(error);
            });
    }

    const countUsers = () => {

        const clients = ref(getDatabase(), 'Client');

        get(clients)
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    console.log("no data");
                }
                else {
                    const list = Object.entries(snapshot.val())
                    setClientCount(list.length)
                    console.log("Client Count: " + list.length);
                    console.log("Client Count: " + list);
                }
            }).catch((error) => {
                console.error(error);
            });
    }


    const countMonthlyIncome = async (month, year) => {

        const shipments = ref(getDatabase(), 'Shipment');


        var ss = await get(shipments);

        if (!ss.exists()) {
                    console.log("no data");
                }
                else {
                    const list = Object.entries(ss.val());
                    var result = 0;

                    for (let index = 0; index < list.length; index++) {

                        if (list[index][1].time_delivered != null) {

                            let shipmentMonth = list[index][1].time_delivered.toString().split("/")[1];
                            let shipmentYear = list[index][1].time_delivered.toString().split("/")[2];

                            if (shipmentMonth == month && shipmentYear == year) {
                                console.log("shipment in " + shipmentMonth + "/" + shipmentYear + " & currently we're in" + month + "/" + year);
                                console.log(list[index] + " has been delivered in :" + list[index][1].time_delivered);
                                result += list[index][1].price;
                            }
                        }
                    }


            if (month == getPrevDate(1).date){
                setLastMonthIncom(result)
            }

            if (month == getPrevDate(0).date) {
                setCurrentMonthIncom(result)
            }
                    console.log("Brute Income of " + month + "/" + year + ": " + result);
                    
                    return result;
                }
            

        return 0;

    }

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


    function confirmOrder(shipmentID, transporterID) {

        const db = getDatabase();

        const data = {
            transporter_id: transporterID,
            time_confirmed: formatDate(new Date()),
            state : "c"
        };

        const id = ref(db, 'Shipment/' + shipmentID);


        getAllOrders();

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
        countWorkingCapacity()
        countOrdersSatisfiedPercent()
        countWorkers()
        countOrdersPending()
        countOrdersMonthly(getPrevDate(0).date , 2023)
        countUsers()
        countMonthlyIncome(getPrevDate(0).date, 2023)
        countMonthlyIncome(getPrevDate(0).date, 2023)


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

                        //document.getElementById("page1").style.zIndex = 2;
                        document.getElementById("page2").style.zIndex = 1;
                        document.getElementById("page3").style.zIndex = 1;
                        document.getElementById("page4").style.zIndex = 1;
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

                            //document.getElementById("page1").style.zIndex = 1;
                            document.getElementById("page4").style.zIndex = 1;
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
                            document.getElementById("page4").style.zIndex = 1;
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

                            //document.getElementById("page1").style.zIndex = 1;
                            document.getElementById("page4").style.zIndex = 2;
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


                    <motion.div className="dashboard-home" id="page1"
                        initial={{opacity:1}}
                        animate={page1 ? { opacity: 1, zIndex: 5 } : { opacity: 0, zIndex: 1 }}
                    >
                        <div className="dashboard-home-left">
                            <div className="dash-home-top">
                                <div className="dash-home-top-left">
                                    <p>Korsaa</p>
                                    <p>Dashboard</p>
                                </div>


                                <div className="dash-home-top-right">
                                    <div className="rech-container">

                                    </div>

                                    <div className="user-circle">

                                    </div>
                                </div>
                            </div>
                            <div className="dash-home-center">
                                    <div className="left-stat">
                                        <div className="big-stat-header">
                                            <p>Net Income By Month</p>
                                            <div className="date-container">
                                                <p>{formatDate(new Date())}</p>
                                            </div>
                                        </div>
                                        <div className="big-stat-corp">
                                            <div className="x-axes">
                                                <div className="x-points">
                                                <p>Jan</p>
                                                </div>
                                                <div className="x-points">
                                                <p>Feb</p>
                                                </div>
                                                <div className="x-points">
                                                <p>Mar</p>
                                                </div>
                                                <div className="x-points">
                                                <p>Avr</p>
                                                </div>
                                                <div className="x-points">
                                                <p>Mai</p>
                                                </div>
                                                <div className="x-points">
                                                <p>Jun</p>
                                                </div>
                                                <div className="x-points">
                                                <p>Jui</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="big-stat-footer">
                                            <div className="fotter-stat">
                                            <p>Last Month</p>
                                            <p>{ months[getPrevDate(1).date - 1]}</p>
                                            <p> {parseInt(lastMonthIncom)} DA</p>
                                            </div>
                                            <div className="fotter-stat">
                                            <p>Current Month</p>
                                            <p>{months[getPrevDate(0).date - 1]}</p>
                                            <p>{parseInt(currentMonthIncom)} DA</p>
                                            </div>
                                            <div className="fotter-stat">
                                            <p>Best Month</p>
                                            <p>Janvier</p>
                                            <p>2550 DA</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="right-stat">
                                        <div className="stat-item">
                                            <div className="top-icon-container">
                                                <img src={order} alt="" />
                                            </div>
                                            <div className="top-text-container">
                                                <p>User Count</p>
                                            </div>

                                        <div className="stat-circle-container">
                                            <p>{clientCount}</p>
                                        </div>
                                        </div>
                                        <div className="stat-item">
                                            <div className="top-stat-item">

                                            </div>
                                            <div className="stat-item-bottom">
                                                <div className="left-stat-content">
                                                    <p className="small-text">statistics</p>
                                                    <p>{orderMonthCount} order</p>
                                                    <p className="small-text">Current Month income</p>
                                                    <p>{currentMonthIncom} DA</p>
                                                </div>
                                                <div className="right-stat-content">
                                                    <img src={arrow} alt="" />
                                                </div>
                                            </div>

                                        <div className="stat-item-bottom back-line">
                                            
                                        </div>
                                        </div>
                                    </div>
                            </div>
                            <div className="dash-home-bottom">
                                <div className="bottom-stat-item">
                                    <div className="bottom-stat-icon">
                                        <img src={order} alt="" />
                                    </div>
                                    <div className="text-container">
                                        <p>Pending Orders</p>
                                        
                                        <p className="small-text">{pendingOrders}</p>
                                    </div>
                                    <div className="line-grph">
                                        <motion.div 
                                        className="loaded-line-grph"
                                            animate={{ width: parseInt(satisfiedOrdersPercent).toFixed(2) + "%"}}
                                        >
                                            
                                        </motion.div>
                                        <div className="grph-text">
                                            <p>Satisfied</p>
                                            <p className="small-text"> {parseInt(satisfiedOrdersPercent).toFixed(2)} %</p>
                                        </div>
                                    </div>

                                    <div className="stat-btn-action">
                                        <p className="small-text">See All</p>
                                    </div>
                                </div>
                                <div className="bottom-stat-item">
                                    <div className="bottom-stat-icon">
                                        <img src={client} alt="" />
                                    </div>
                                    <div className="text-container">
                                        <p>Workers in Service</p>
                                        <p className="small-text">{workerService}</p>
                                    </div>
                                    <div className="line-grph">
                                        <motion.div
                                            className="loaded-line-grph"
                                            animate={{ width: parseInt(workingCapacity) + "%" }}
                                        >

                                        </motion.div>
                                        <div className="grph-text">
                                            <p>Capacity</p>
                                            <p className="small-text">{workingCapacity}%</p>
                                        </div>
                                    </div>

                                    <div className="stat-btn-action">
                                        <p className="small-text">See All</p>
                                    </div>
                                </div>
                                <div className="bottom-stat-item">
                                    <div className="bottom-stat-icon">
                                        <img src={livreur} alt="" />
                                    </div>
                                    <div className="text-container">
                                        <p>Confirled Orders</p>
                                        <p className="small-text">small text</p>
                                    </div>
                                    <div className="line-grph">
                                        <div className="loaded-line-grph">

                                        </div>
                                        <div className="grph-text">
                                            <p>Progress</p>
                                            <p className="small-text">80%</p>
                                        </div>
                                    </div>

                                    <div className="stat-btn-action">
                                        <p className="small-text">See All</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-home-right">
                            <div className="side-header">
                                <div className="side-header-icon">
                                    <img src={task} alt="" />
                                    <p>Lists</p>
                                </div>

                                <p className="small-text">See All</p>
                            </div>

                            <div className="side-filter">
                                <motion.div className="select-list-btn"
                                    animate={switchStatList == 0 ? { backgroundColor:"#362FD9"}:{backgroundColor:"transparent"}}

                                    onClick={()=> {
                                        setSwitchStatList(0)
                                    }}
                                >
                                    <p>Transporter</p>
                                </motion.div>
                                <motion.div className="select-list-btn"
                                    animate={switchStatList == 1 ? { backgroundColor: "#362FD9" } : { backgroundColor: "transparent" }}
                                    onClick={() => {
                                        setSwitchStatList(1)
                                    }}
                                >
                                    <p>Client</p>
                                </motion.div>
                            </div>
                            <div className="side-list">
                                {
                                    switchStatList == 0 ? 
                                    allTransporters.map((item , index)=> {
                                        return(
                                            <div className="side-list-item">
                                                <div className="side-item-left">
                                                    <div className="user-img"></div>
                                                    <div className="side-list-item-text">
                                                        <p className="id">{item.name}</p>
                                                        <p className="small-text">Client order 1</p>
                                                        <p className="small-text">07/02/2023</p>

                                                    </div>
                                                </div>
                                                <div className="side-item-right">
                                                    <div className="side-list-action">
                                                        <img src={setting} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })

                                    :
                                        allClient.map((item, index) => {
                                            return (
                                                <div className="side-list-item">
                                                    <div className="side-item-left">
                                                        <div className="user-img"></div>
                                                        <div className="side-list-item-text">
                                                            <p className="id">Xyja01</p>
                                                            <p className="small-text">Client order 1</p>
                                                            <p className="small-text">07/02/2023</p>

                                                        </div>
                                                    </div>
                                                    <div className="side-item-right">
                                                        <div className="side-list-action">
                                                            <img src={setting} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                }


                               

                                

                            </div>
                            <div className="side-img-bottom">


                            </div>

                        </div>
                    </motion.div>

                    
                    {
                        page2 ? 
                            <OrderPage choiceTransoporter={choiceTransoporter} setChoiceTransoporter={setChoiceTransoporter} setShowTransporterInfos={setShowTransporterInfos} setShowOrdersOverlay={setShowOrdersOverlay} setShowOrdersOverlay={setShowOrdersOverlay} showTransporterInfos={showTransporterInfos} anime={page2} selectOrderTransoprter={selectOrderTransoprter} selectedOrderToUpdate={selectedOrderToUpdate} setSelectTranspOverlay={setSelectTranspOverlay}/>
                        :
                        null
                    }

                    {
                        page3 ?
                            <TransporterPage setShowNewTransoprterOverlay={setShowNewTransoprterOverlay} setSelectedTranspDetail={setSelectedTranspDetail} setShowTranspDetails={setShowTranspDetails} choiceTransoporter={choiceTransoporter} setChoiceTransoporter={setChoiceTransoporter} setShowTransporterInfos={setShowTransporterInfos} setShowOrdersOverlay={setShowOrdersOverlay} setShowOrdersOverlay={setShowOrdersOverlay} showTransporterInfos={showTransporterInfos} anime={page3} selectOrderTransoprter={selectOrderTransoprter} selectedOrderToUpdate={selectedOrderToUpdate} setSelectTranspOverlay={setSelectTranspOverlay} />
                            :
                            null
                    }





                    <motion.div className="dashboard-orders client-page" id="page4"
                        initial={{ opacity: 0 }}
                        animate={page4 ? { opacity: 1 } : { opacity: 0 }}
                    >

                        <div className="client-page-content">
                            <div className="clients-left">
                                <div className="dash-page-title">
                                    <p>Korsaa</p>
                                    <p>My Clients</p>
                                </div>


                                <div className="orders-filters">

                                    <div onClick={() => {
                                        setSelectedStateFilter(0);
                                        filterByState("a");
                                    }}>
                                        <p>All</p>
                                        <motion.div
                                            className="selected-order-filter"
                                            initial={{ width: "100%" }}
                                            animate={selectedStateFilter == 0 ? { width: "100%" } : { width: 0 }}
                                        >

                                        </motion.div>
                                    </div>

                                    <div onClick={() => {
                                        setSelectedStateFilter(1);
                                        filterByState("w");
                                    }}>
                                        <p>Waiting</p>
                                        <motion.div
                                            className="selected-order-filter"
                                            initial={{ width: "100%" }}
                                            animate={selectedStateFilter == 1 ? { width: "100%" } : { width: 0 }}
                                        >

                                        </motion.div>
                                    </div>

                                    <div onClick={() => {
                                        setSelectedStateFilter(2);
                                        filterByState("c");
                                    }}>
                                        <p>Confirmed</p>
                                        <motion.div
                                            className="selected-order-filter"
                                            initial={{ width: "100%" }}
                                            animate={selectedStateFilter == 2 ? { width: "100%" } : { width: 0 }}
                                        >

                                        </motion.div>
                                    </div>

                                    <div onClick={() => {
                                        setSelectedStateFilter(0);
                                        filterByState("a");
                                    }}>
                                        <p>in-progress</p>
                                    </div>

                                    <div onClick={() => {
                                        setSelectedStateFilter(0);
                                        filterByState("a");
                                    }}>
                                        <p>Delivred</p>
                                    </div>

                                    <div onClick={() => {
                                        setSelectedStateFilter(0);
                                        filterByState("a");
                                    }}>
                                        <p>Canceled</p>
                                    </div>
                                </div>

                                <div className="filters-container">
                                    <div className="filer-components"
                                        onClick={() => {

                                            setShowSelect1(true)
                                        }}


                                    >
                                        <p>Custumize</p>

                                        <motion.div
                                            id="select-option"
                                            className="filter-select"
                                            initial={{ opacity: 0, top: "50%" }}
                                            animate={showSelectOption1 ? { opacity: 1, top: "120%", transition: { ease: "backInOut" } } : { opacity: 0, top: "50%", transition: { ease: "backInOut" } }}

                                        >
                                            <div className="filter-options"
                                                onClick={() => {

                                                    const arr = selectedField.map(function (item, index) {
                                                        if (index === 0) {
                                                            item = !item;
                                                        }
                                                        return item;
                                                    })

                                                    setSelectedField(arr)

                                                    console.log(selectedField)
                                                    console.log(selectedField[0])

                                                }}
                                            >
                                                <p>id</p>
                                                <motion.p
                                                    className="select-text-action"
                                                    animate={!selectedField[0] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    show
                                            </motion.p>

                                                <motion.p
                                                    className="select-text-action"
                                                    animate={selectedField[0] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    hide
                                            </motion.p>
                                            </div>
                                            <div className="filter-options"

                                                onClick={() => {

                                                    const arr = selectedField.map(function (item, index) {
                                                        if (index === 1) {
                                                            item = !item;
                                                        }
                                                        return item;
                                                    })

                                                    setSelectedField(arr)

                                                    console.log(selectedField)

                                                }}
                                            >
                                                <p>client</p>
                                                <motion.p
                                                    className="select-text-action"
                                                    animate={!selectedField[1] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    show
                                            </motion.p>

                                                <motion.p
                                                    className="select-text-action"
                                                    animate={selectedField[1] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    hide
                                            </motion.p>
                                            </div>
                                            <div className="filter-options"
                                                onClick={() => {

                                                    const arr = selectedField.map(function (item, index) {
                                                        if (index === 2) {
                                                            item = !item;
                                                        }
                                                        return item;
                                                    })

                                                    setSelectedField(arr)

                                                    console.log(selectedField)
                                                    console.log(selectedField[0])

                                                }}
                                            >
                                                <p>Date</p>
                                                <motion.p
                                                    className="select-text-action"
                                                    animate={!selectedField[2] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    show
                                            </motion.p>

                                                <motion.p
                                                    className="select-text-action"
                                                    animate={selectedField[2] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    hide
                                            </motion.p>
                                            </div>
                                            <div className="filter-options"
                                                onClick={() => {

                                                    const arr = selectedField.map(function (item, index) {
                                                        if (index === 3) {
                                                            item = !item;
                                                        }
                                                        return item;
                                                    })

                                                    setSelectedField(arr)

                                                    console.log(selectedField)
                                                    console.log(selectedField[0])

                                                }}
                                            >
                                                <p>From</p>
                                                <motion.p
                                                    className="select-text-action"
                                                    animate={!selectedField[3] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    show
                                            </motion.p>

                                                <motion.p
                                                    className="select-text-action"
                                                    animate={selectedField[3] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    hide
                                            </motion.p>
                                            </div>
                                            <div className="filter-options"
                                                onClick={() => {

                                                    const arr = selectedField.map(function (item, index) {
                                                        if (index === 4) {
                                                            item = !item;
                                                        }
                                                        return item;
                                                    })

                                                    setSelectedField(arr)

                                                    console.log(selectedField)
                                                    console.log(selectedField[0])

                                                }}
                                            >
                                                <p>To</p>
                                                <motion.p
                                                    className="select-text-action"
                                                    animate={!selectedField[4] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    show
                                            </motion.p>

                                                <motion.p
                                                    className="select-text-action"
                                                    animate={selectedField[4] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    hide
                                            </motion.p>
                                            </div>
                                            <div className="filter-options"
                                                onClick={() => {

                                                    const arr = selectedField.map(function (item, index) {
                                                        if (index === 5) {
                                                            item = !item;
                                                        }
                                                        return item;
                                                    })

                                                    setSelectedField(arr)

                                                    console.log(selectedField)
                                                    console.log(selectedField[0])

                                                }}
                                            >
                                                <p>paiment</p>
                                                <motion.p
                                                    className="select-text-action"
                                                    animate={!selectedField[5] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    show
                                            </motion.p>

                                                <motion.p
                                                    className="select-text-action"
                                                    animate={selectedField[5] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    hide
                                            </motion.p>
                                            </div>
                                            <div className="filter-options"
                                                onClick={() => {

                                                    const arr = selectedField.map(function (item, index) {
                                                        if (index === 6) {
                                                            item = !item;
                                                        }
                                                        return item;
                                                    })

                                                    setSelectedField(arr)

                                                    console.log(selectedField)
                                                    console.log(selectedField[0])

                                                }}
                                            >
                                                <p>Price</p>
                                                <motion.p
                                                    className="select-text-action"
                                                    animate={!selectedField[6] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    show
                                            </motion.p>

                                                <motion.p
                                                    className="select-text-action"
                                                    animate={selectedField[6] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    hide
                                            </motion.p>
                                            </div>

                                            <div className="filter-options"

                                                onClick={() => {

                                                    const arr = selectedField.map(function (item, index) {
                                                        if (index === 7) {
                                                            item = !item;
                                                        }
                                                        return item;
                                                    })

                                                    setSelectedField(arr)

                                                    console.log(selectedField)
                                                    console.log(selectedField[0])

                                                }}
                                            >
                                                <p>State</p>
                                                <motion.p
                                                    className="select-text-action"
                                                    animate={!selectedField[7] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    show
                                            </motion.p>

                                                <motion.p
                                                    className="select-text-action"
                                                    animate={selectedField[7] ? { opacity: 1 } : { opacity: 0 }}
                                                >
                                                    hide
                                            </motion.p>
                                            </div>
                                        </motion.div>
                                    </div>
                                    <div className="filer-components"
                                        onClick={() => {
                                            setShowSelect2(true)
                                        }}
                                    >
                                        <p>Sort By</p>


                                        <motion.div
                                            id="select-option2"
                                            className="filter-select"
                                            initial={{ opacity: 0, top: "50%" }}
                                            animate={showSelectOption2 ? { opacity: 1, top: "120%", transition: { ease: "backInOut" } } : {
                                                opacity: 0, top: "50%", transition: { ease: "backInOut" }
                                            }}
                                        >

                                            <div className="filter-options"
                                                onClick={() => {


                                                }}
                                            >
                                                <p>Price</p>

                                            </div>

                                            <div className="filter-options"
                                                onClick={() => {

                                                    
                                                }}
                                            >
                                                <p>Client Name</p>

                                            </div>
                                        </motion.div>
                                    </div>

                                </div>

                                <div className="orders-list">
                                    <motion.div className="order-list-item">
                                        <motion.p
                                            initial={{ opacity: 1 }}
                                            animate={selectedField[0] ? { opacity: 1 } : { opacity: 0, display: "none", }}
                                        >Id</motion.p>
                                        <motion.p
                                            initial={{ opacity: 1 }}
                                            animate={selectedField[1] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                        >Client</motion.p>
                                        <motion.p
                                            initial={{ opacity: 1 }}
                                            animate={selectedField[2] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                        >Phone</motion.p>
                                        <motion.p
                                            initial={{ opacity: 1 }}
                                            animate={selectedField[3] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                        >Email</motion.p>
                                        <motion.p
                                            initial={{ opacity: 1 }}
                                            animate={selectedField[4] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                        >Company</motion.p>
                                        <motion.p
                                            initial={{ opacity: 1 }}
                                            animate={selectedField[5] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                        >Business Nature</motion.p>
                                        <motion.p
                                            initial={{ opacity: 1 }}
                                            animate={selectedField[6] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                        >location</motion.p>

                                        <motion.p
                                            initial={{ opacity: 1 }}
                                            animate={selectedField[7] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                        >State</motion.p>
                                    </motion.div>
                                    {
                                        filterClinet.length == 0 ?
                                            allClient.map((item , index) => {
                                                return (
                                                    <div>
                                                        <div className="order-list-item">
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[0] ? { opacity: 1 } : { opacity: 0, display: "none", }}
                                                            >{index + 1}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[1] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.name}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[2] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.phone}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[3] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.email}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[4] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.company_name}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[5] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.business_nature}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[6] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.location} DA</motion.p>
                                                            <motion.p className="state-container"
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[7] ? { opacity: 1 } : { display: "none", opacity: 0 }}
                                                            >
                                                                <div className={item.state === "w" ? "stat-circle bkYellow" : "stat-circle bkBlue"} >
                                                                    {item.state === "w" ? <p>W</p> : <p>C</p>}
                                                                </div>
                                                            </motion.p>
                                                            <div className="action"
                                                                onClick={() => {
                                                                    setShowOrderAction(index)
                                                                }}
                                                            >
                                                                <img src={actions} alt="" />
                                                            </div>
                                                        </div>

                                                        <motion.div className="order-list-item order-actions-container"
                                                            initial={{ height: "0", opacity: 0 }}
                                                            animate={showOrderAction == index? { height: "60px", opacity: 1, transition: { delay: 0 } } : { height: "0", opacity: 0, transition: { delay: 0 } }}
                                                        >

                                                            <motion.div className="order-action bkBlue"
                                                                initial={{ opacity: 0 }}
                                                                animate={showOrderAction == index? { opacity: 1 } : { opacity: 0 }}

                                                            >
                                                                <p>Select Transporter</p>
                                                            </motion.div>
                                                            <motion.div className="order-action bkRed"
                                                                initial={{ opacity: 0 }}
                                                                animate={showOrderAction == index? { opacity: 1 } : { opacity: 0 }}
                                                                onClick={() => {
                                                                    setMountClientDetails(true)
                                                                    setSelectedClientDetail(item)
                                                                    setShowClinetDetails(true);
                                                                }}

                                                            >
                                                                <p>More details</p>
                                                            </motion.div>
                                                            <motion.div className="order-action bkYellow"
                                                                initial={{ opacity: 0 }}
                                                                animate={showOrderAction == index? { opacity: 1 } : { opacity: 0 }}
                                                            >
                                                                <p>Cancel</p>
                                                            </motion.div>
                                                        </motion.div>
                                                    </div>
                                                )
                                            }
                                            )

                                            :

                                            filterClinet.map((item , index) => {
                                                return (
                                                    <div>
                                                        <div className="order-list-item">
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[0] ? { opacity: 1 } : { opacity: 0, display: "none", }}
                                                            >{index + 1}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[1] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.name}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[2] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.phone}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[3] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.email}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[4] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.company_name}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[5] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.business_nature}</motion.p>
                                                            <motion.p
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[6] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                            >{item.location} DA</motion.p>
                                                            <motion.p className="state-container"
                                                                initial={{ opacity: 1 }}
                                                                animate={selectedField[7] ? { opacity: 1 } : { display: "none", opacity: 0 }}
                                                            >
                                                                <div className={item.state === "w" ? "stat-circle bkYellow" : "stat-circle bkBlue"} >
                                                                    {item.state === "w" ? <p>W</p> : <p>C</p>}
                                                                </div>
                                                            </motion.p>
                                                            <div className="action"
                                                                onClick={() => {
                                                                    setShowOrderAction(index)
                                                                }}
                                                            >
                                                                <img src={actions} alt="" />
                                                            </div>
                                                        </div>

                                                        <motion.div className="order-list-item order-actions-container"
                                                            initial={{ height: "0", opacity: 0 }}
                                                            animate={showOrderAction  == index? { height: "60px", opacity: 1, transition: { delay: 0 } } : { height: "0", opacity: 0, transition: { delay: 0 } }}
                                                        >

                                                            <motion.div className="order-action bkBlue"
                                                                initial={{ opacity: 0 }}
                                                                animate={showOrderAction == index ? { opacity: 1 } : { opacity: 0 }}

                                                            >
                                                                <p>Select Transporter</p>
                                                            </motion.div>
                                                            <motion.div className="order-action bkRed"
                                                                initial={{ opacity: 0 }}
                                                                animate={showOrderAction == index ? { opacity: 1 } : { opacity: 0 }}
                                                                onClick={() => {
                                                                    setMountClientDetails(true)
                                                                    setSelectedClientDetail(item)
                                                                    setShowClinetDetails(true);
                                                                }}

                                                            >
                                                                <p>More details</p>
                                                            </motion.div>
                                                            <motion.div className="order-action bkYellow"
                                                                initial={{ opacity: 0 }}
                                                                animate={showOrderAction == index ? { opacity: 1 } : { opacity: 0 }}
                                                            >
                                                                <p>Cancel</p>
                                                            </motion.div>
                                                        </motion.div>
                                                    </div>
                                                )
                                            })
                                    }





                                </div>
                            </div>
                            

                            <div className="clients-right">
                                <p>Clients Stat</p>
                                <div className="client-stat-item">
                                    
                                    <div className="client-stat-item-left">
                                        <div className="client-stat-item-img">
                                            <img src={client} alt="" />
                                        </div>
                                        <p>Client Count</p>
                                        
                                    </div>

                                    <p>354 <span>(C)</span></p>
                                </div>

                                <div className="client-stat-item">

                                    <div className="client-stat-item-left">
                                        <div className="client-stat-item-img">
                                            <img src={client} alt="" />
                                        </div>
                                        <p>Actif Client</p>

                                    </div>

                                    <p>354 <span>(C)</span></p>
                                </div>

                                <div className="client-stat-item">

                                    <div className="client-stat-item-left">
                                        <div className="client-stat-item-img">
                                            <img src={client} alt="" />
                                        </div>
                                        <p>Inactif Count</p>

                                    </div>

                                    <p>354 <span>(C)</span></p>
                                </div>

                                <div className="client-stat-item">

                                    <div className="client-stat-item-left">
                                        <div className="client-stat-item-img">
                                            <img src={client} alt="" />
                                        </div>
                                        <p>Best Client</p>

                                    </div>

                                    <p>354 <span>(C)</span></p>
                                </div>

                                <div className="client-stat-item">


                                    <img src={client} alt="" />
                                    <div className="circler-stat">
                                        <p>354 <span>(C)</span></p>
                                    </div>
                                    <p>Client Count</p>

                                    <div className="action-btn">
                                        <p>More Info</p>
                                    </div>

                                    <div className="colored-back"></div>
                                </div>
                            </div>
                        </div>
                        
                    </motion.div>

                    <motion.div className="dashboard-orders"
                        initial={{ opacity: 0 }}
                        animate={page5 ? { opacity: 1 } : { opacity: 0 }}
                    >

                        <p>Registration Request Page Comming Soon...</p>
                        <img src={loadingIcon} alt="" />
                    </motion.div>


                    
                </div>
            </div>

            <motion.div className="order-details-overlay"
                initial={{ scale: 0, opacity: 0, display: "none" }}
                animate={showOrdersOverlay ? { scale: 1, display: "flex", opacity: 1 } : { scale: 0.5, opacity: 0 , transition:{ease:"easeInOut"}}}
                exit={{ display: "none"}}
                onClick={()=> {
                    setShowOrdersOverlay(false);
                }}
            >
                <div className="order-details-container ">
                    <OrderDetails order={selectedOrder}></OrderDetails>
                </div>
            </motion.div>


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

                    <TransporterForm list={allTransporters} close={() => setShowNewTransoprterOverlay(false)} update={() =>getAllTransporter()}></TransporterForm>
                </div>
            </motion.div>

            {
                selectedTranspDetail != null ?
                <TranspDetails transp={selectedTranspDetail} visible={showTranspDetails} close={() => {setShowTranspDetails(false) ; setMountTranspDetails(false)}} />
                :
                null
            }
            
            {
                mountClientDetails ?
                    <ClientDetails client={selectedClientDetail} visible={showClientDetails} close={() => { setShowClinetDetails(false); setMountClientDetails(false)}} />
                :
                null
            }
            
            
            <SelectTranspConf selectTranspOverlay={selectTranspOverlay} setSelectTranspOverlay={setSelectTranspOverlay} transp={selectedTransp} order={selectedOrder} confirmOrder={confirmOrder} updateView={getAllOrders} />
        </motion.div>
    );
}

export default Dasboard;