
import "../styles/TransporterForm.css"

import { motion } from "framer-motion"

import React, { useState, useEffect } from 'react';

import exit from "../asstes/dashboard/exit.png"
import actions from "../asstes/dashboard/actions.png"
import arrow from "../asstes/dashboard/arrow.png"

import { getDatabase, ref, set, push, get } from "firebase/database";



function OrderPage({ choiceTransoporter, setChoiceTransoporter, setShowTransporterInfos , anime, selectOrderTransoprter, setSelectTranspOverlay, showTransporterInfos, setShowOrdersOverlay  }) {


    const [selectedStateFilter, setSelectedStateFilter] = useState(0);
    const [showSelectOption1, setShowSelect1] = useState(false);

    const initSelected = [true, true, true, true, true, true, true, true];
    const [selectedField, setSelectedField] = useState(initSelected);

    const [presAllOrders, setPresAllOrders] = useState([]);


    const [allOrders, setAllOrders] = useState([]);
    const [filterOrders, setFilterOrders] = useState([]);

    const [allTransporters, setAllTransporters] = useState([]);
    const [filteTransporters, setFilterTransporters] = useState([]);


    const [selectedDateAnim, setSelectedDateAnim] = useState(6);
    const [showOrderAction, setShowOrderAction] = useState(-1);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState(null);
    const [showSelectOption2, setShowSelect2] = useState(false);


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


    const getPrevDate = (i) => {
        var date = new Date();
        date.setDate(date.getDate() - i);
        var res = { day: date.toString().split(" ")[0], date: date.toString().split(" ")[2] };
        return res;
    }

    const formatDate = (date) => {

        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();

        var res = dd + '/' + mm + '/' + yyyy;
        return res;
    }


    const filterTransoprterOnSelect = (payment, from) => {
        console.log(payment + " " + from)

        var res = []
        allTransporters.map((item) => {
            if (item.payment_method == payment && item.city == from) {
                res.push(item)
            }
        })

        setChoiceTransoporter(res);
    }

    const getOrdersByDate = (date) => {
        //must change : store all orders in a var

        console.log("getOrdersByDate.....")
        console.log(date)
        var res = [];
        presAllOrders.map((item) => {
            console.log(item)
            if (item.date === date) {
                res.push(item)
            }
        })

        setAllOrders(res)
        setFilterOrders(res)




    }


    const sortBy = (list, prop) => {
        var res = [];
        if (list === "orders") {
            console.log("sort by")
            if (prop === "name") {
                res = filterOrders;
                res.sort(compareName)
                console.log("name")
                setFilterOrders(res);
            } else {

                res = filterOrders;
                res.sort(compare)
                console.log("price")
                setFilterOrders(res);
            }
        } else {
            if (list === "clients") {

            } else {

            }
        }

    }


    const filterByState = (filter) => {

        var filterRes = [];
        if (filter == "a") {
            setFilterOrders(allOrders);
        } else {

            allOrders.map((item) => {
                if (item.state === filter) {
                    filterRes.push(item);
                }
            })

            setFilterOrders(filterRes);
        }
    }


    const getAllOrders = () => {

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

    const getClientById = async (id) => {


        const db = getDatabase();
        const shipments = ref(db, 'Client');
        let ss = await get(shipments);

        const data = ss.val();
        const list = Object.entries(data)
        for (let i = 0; i < list.length; i++) {
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
                    transps.push({ id: element[0], name: element[1].name, city: element[1].city, location: element[1].location, email: element[1].email, payment_method: element[1].payment_method, phone: element[1].phone, state: element[1].status, vehicle_type: element[1].vehicle, date: "12/12/2023" })
                    console.log(element[1].name)

                });

                setAllTransporters(transps)
                setChoiceTransoporter(transps)
            })
    }


    useEffect(()=> {

        getAllOrders();
        getAllTransporter();


        window.addEventListener('click', function (e) {
            if (document.getElementById('select-option') != null && !document.getElementById('select-option').contains(e.target)) {
                setShowSelect1(false)

            }

            if (document.getElementById('select-option2') != null && !document.getElementById('select-option2').contains(e.target)) {
                setShowSelect2(false)

            }

            






        });
    },[])

    return(
        <motion.div className="dashboard-orders orders-page" id="page2"
                        initial={{ opacity: 0 }}
                        animate={anime ? { opacity: 1 } : { opacity: 0 }}
                    >

                        <div className="left-orders">
                            <div className="dash-page-title">
                                <p>Korsaa</p>
                                <p>My Orders</p>
                            </div>

                            <div className="orders-filters">
                                
                                <div onClick={()=> {
                                    setSelectedStateFilter(0);
                                    filterByState("a");
                                }}>
                                    <p>All</p>
                                    <motion.div 
                                    className="selected-order-filter"
                                    initial={{width:"100%"}}
                                    animate={selectedStateFilter == 0 ? {width:"100%"} : {width:0}}
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
                                    onClick={()=> {
                                        
                                        setShowSelect1(true)
                                    }}

                                    
                                >
                                    <p>Custumize</p>

                                    <motion.div 
                                    id="select-option"
                                    className="filter-select"
                                    initial={{opacity : 0 , top : "50%"}}
                                    animate={showSelectOption1 ? { opacity: 1, top: "120%", transition: { ease: "backInOut" } } : { opacity: 0, top: "50%", transition: { ease: "backInOut" }}}
                                    
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
                                                animate={!selectedField[0] ? { opacity: 1 } : { opacity: 0}}
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

                                                const arr = selectedField.map(function (item,index) {
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
                                    onClick={(e) => {
                                        setShowSelect2(true)
                                    }}
                                >
                                    <p>Sort By</p>

                                    
                                    <motion.div
                                        id="select-option2"
                                        className="filter-select"
                                        initial={{ opacity: 0, top: "50%" }}
                                        animate={showSelectOption2 ? { opacity: 1,top: "120%", transition: { ease: "backInOut" } } : {
                                            opacity: 0,  top: "50%", transition: { ease: "backInOut" } }}
                                        >

                                        <div className="filter-options"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                sortBy("orders", "price")
                                            }}
                                        >
                                            <p>Price</p>
                                            
                                        </div>

                                        <div className="filter-options"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                sortBy("orders" , "name")
                                            }}
                                        >
                                            <p>Client Name</p>

                                        </div>
                                    </motion.div>
                                </div>
                               
                            </div>

                            <div className="orders-list" id="orders-list">
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

                                    >Date</motion.p>
                                    <motion.p
                                        initial={{ opacity: 1 }}
                                        animate={selectedField[3] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                    >From</motion.p>
                                    <motion.p
                                        initial={{ opacity: 1 }}
                                        animate={selectedField[4] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                    >To</motion.p>
                                    <motion.p
                                        initial={{ opacity: 1 }}
                                        animate={selectedField[5] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                    >Paiment</motion.p>
                                    <motion.p
                                        initial={{ opacity: 1 }}
                                        animate={selectedField[6] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                    >Price</motion.p>

                                    <motion.p
                                        initial={{ opacity: 1 }}
                                        animate={selectedField[7] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                    >State</motion.p>
                                </motion.div>
                                {
                                    filterOrders.length == 0 ? 
                                    allOrders.map((item , index)=> {
                                        return(
                                            <div>
                                                <div className="order-list-item">
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[0] ? { opacity: 1 } : { opacity: 0, display: "none", }}
                                                    >{index + 1}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[1] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.client}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[2] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.date}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[3] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.from}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[4] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.to}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[5] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.paiment}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[6] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.price} DA</motion.p>
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
                                                    animate={showOrderAction == index ? { height: "60px", opacity: 1, transition: { delay: 0 } } : { height: "0", opacity: 0, transition: { delay: 0 } }}
                                                >

                                                    <motion.div className="order-action bkBlue"
                                                        initial={{ opacity: 0 }}
                                                        animate={showOrderAction  == index ? { opacity: 1 } : { opacity: 0 }}
                                                        onClick={()=> {
                                                            filterTransoprterOnSelect(item.paiment , item.from)
                                                            setSelectedOrderToUpdate(item)
                                                            setSelectedOrder(item);
                                                        }}
                                                    >
                                                        <p>Select Transporter</p>
                                                    </motion.div>
                                                    <motion.div className="order-action bkRed"
                                                        initial={{ opacity: 0 }}
                                                        animate={showOrderAction == index ? { opacity: 1 } : { opacity: 0 }}
                                                        onClick={() => {
                                                            setShowOrdersOverlay(true);
                                                            setSelectedOrder(item);
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
                                    }
                                    )
                                
                                    :
                                    
                                    filterOrders.map((item , index)=> {
                                        return(
                                            <div>
                                                <div className="order-list-item">
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[0] ? { opacity: 1 } : { opacity: 0, display: "none", }}
                                                    >{index + 1}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[1] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.client}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[2] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.date}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[3] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.from}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[4] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.to}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[5] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.paiment}</motion.p>
                                                    <motion.p
                                                        initial={{ opacity: 1 }}
                                                        animate={selectedField[6] ? { opacity: 1 } : { display: "none", opacity: 0 }}

                                                    >{item.price} DA</motion.p>
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
                                                    animate={showOrderAction == index ? { height: "60px", opacity: 1, transition: { delay: 0 } } : { height: "0", opacity: 0, transition: { delay: 0 } }}
                                                >

                                                    <motion.div className="order-action bkBlue"
                                                        initial={{ opacity: 0 }}
                                                        animate={showOrderAction  == index ? { opacity: 1 } : { opacity: 0 }}
                                                        onClick={()=> {
                                                            filterTransoprterOnSelect(item.paiment , item.from);
                                                            setSelectedOrderToUpdate(item)
                                                            setSelectedOrder(item);
                                                        }}
                                                    >
                                                        <p>Select Transporter</p>
                                                    </motion.div>
                                                    <motion.div className="order-action bkRed"
                                                        initial={{ opacity: 0 }}
                                                        animate={showOrderAction == index ? { opacity: 1 } : { opacity: 0 }}
                                                        onClick={() => {
                                                            setShowOrdersOverlay(true);
                                                            setSelectedOrder(item);
                                                        }}

                                                    >
                                                        <p>More details</p>
                                                    </motion.div>
                                                    <motion.div className="order-action bkYellow"
                                                        initial={{ opacity: 0 }}
                                                        animate={showOrderAction ? { opacity: 1 } : { opacity: 0 }}
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
                        <div className="right-orders">
                            <div className="date-picker-container">
                                <div className="date-container">
                                    <p>2023/10/29</p>
                                </div>
                            </div>

                            <div className="date-items-list">
                                <motion.div className="date-item"
                                    animate={selectedDateAnim == 6 ? { backgroundColor: "#362FD9", color: "white"} : { backgroundColor: "transparent"}}
                                    onClick={()=> {
                                        setSelectedDateAnim(6)
                                        var date = new Date();
                                        date.setDate(date.getDate() - 6);

                                        getOrdersByDate(formatDate(date));
                                    }}
                                >
                                    <p>{getPrevDate(6).day}</p>
                                    <p>{getPrevDate(6).date}</p>
                                </motion.div>
                                <motion.div className="date-item"
                                    animate={selectedDateAnim == 5 ? { backgroundColor: "#362FD9", color: "white"} : { backgroundColor: "transparent" }}
                                    onClick={() => {
                                        setSelectedDateAnim(5)
                                        var date = new Date();
                                        date.setDate(date.getDate() - 5);
                                        getOrdersByDate(formatDate(date));
                                    
                                    }}
                                >
                                    <p>{getPrevDate(5).day}</p>
                                    <p>{getPrevDate(5).date}</p>
                                </motion.div>
                                <motion.div className="date-item"
                                    animate={selectedDateAnim == 4 ? { backgroundColor: "#362FD9", color: "white"} : { backgroundColor: "transparent" }}
                                    onClick={() => {
                                        setSelectedDateAnim(4)
                                        var date = new Date();
                                        date.setDate(date.getDate() - 4);
                                        getOrdersByDate(formatDate(date));
                                    }}
                                >
                                    <p>{getPrevDate(4).day}</p>
                                    <p>{getPrevDate(4).date}</p>
                                </motion.div>
                                <motion.div className="date-item"
                                    animate={selectedDateAnim == 3 ? { backgroundColor: "#362FD9" , color:"white" } : { backgroundColor: "transparent" }}
                                    onClick={() => {
                                        setSelectedDateAnim(3)
                                        var date = new Date();
                                        date.setDate(date.getDate() - 3);
                                        console.log(formatDate(date))
                                        getOrdersByDate(formatDate(date));
                                    }}
                                >
                                    <p>{getPrevDate(3).day}</p>
                                    <p>{getPrevDate(3).date}</p>
                                </motion.div>
                                <motion.div className="date-item"
                                    animate={selectedDateAnim == 2 ? { backgroundColor: "#362FD9", color: "white"} : { backgroundColor: "transparent" }}
                                    onClick={() => {
                                        setSelectedDateAnim(2)
                                        var date = new Date();
                                        date.setDate(date.getDate() - 2);
                                        console.log(formatDate(date))
                                        getOrdersByDate(formatDate(date));
                                    }}
                                >
                                    <p>{getPrevDate(2).day}</p>
                                    <p>{getPrevDate(2).date}</p>
                                </motion.div>
                                <motion.div className="date-item"
                                    animate={selectedDateAnim == 1 ? { backgroundColor: "#362FD9", color: "white" } : { backgroundColor: "transparent" }}
                                    onClick={() => {
                                        setSelectedDateAnim(1)
                                        var date = new Date();
                                        date.setDate(date.getDate() - 1);
                                        console.log(formatDate(date))
                                        getOrdersByDate(formatDate(date));
                                    }}
                                >
                                    <p>{getPrevDate(1).day}</p>
                                    <p>{getPrevDate(1).date}</p>
                                </motion.div>
                                <motion.div className="date-item"
                                    animate={selectedDateAnim == 0 ? { backgroundColor: "#362FD9", color: "white"} : { backgroundColor: "transparent" }}
                                    onClick={() => {
                                        setSelectedDateAnim(0)
                                        var date = new Date();
                                        date.setDate(date.getDate() );
                                        console.log(formatDate(date))
                                        getOrdersByDate(formatDate(date));
                                    }}
                                >
                                    <p>{getPrevDate(0).day}</p>
                                    <p>{getPrevDate(0).date}</p>
                                </motion.div>
                            </div>


                            <div className="transporter-side-list-container">
                                <p>Transporter</p>
                                
                                <div className="rech-container">

                                </div>
                                <div className="filters-container">
                                    <motion.div className="filer-components"
                                        animate={choiceTransoporter.length == 0 ? { backgroundColor: "#362FD9", color: "white" } : { backgroundColor: "transparent", color: "black" }}

                                        onClick={()=> {
                                            setChoiceTransoporter([]);
                                        }}
                                    >
                                        <p>All</p>
                                    </motion.div>
                                    <motion.div className="filer-components"
                                        animate={choiceTransoporter.length != 0 ? { backgroundColor: "#362FD9", color: "white" } : { backgroundColor : "transparent" , color:"black"}}
                                    >
                                        <p>Filtred</p>
                                    </motion.div>
                                </div>
                                

                                <div className="transporter-side-list">
                                   
                                   {
                                        choiceTransoporter.length != 0 ?
                                       choiceTransoporter.map((item , index)=> {
                                           return(
                                               <div>
                                                   <div className="transporter-item">
                                                       <div className="left-transporter">
                                                           <div className="transporter-icon">
                                                               <img src={arrow} alt="" />
                                                           </div>

                                                           <div className="transporter-text">
                                                               <p>{item.name}</p>
                                                               <p className="small-text">Korssa Transporter</p>
                                                           </div>
                                                       </div>

                                                       <div className="transporter-action"
                                                           onClick={() => {
                                                               setShowTransporterInfos(index )
                                                           }}
                                                       >
                                                           <img src={actions} alt="" />
                                                       </div>

                                                   </div>

                                                   <motion.div className="transporter-infos"
                                                       initial={{ height: "0", opacity: 0 }}
                                                       animate={showTransporterInfos == index ? { height: "60px", opacity: 1 } : { height: "0", opacity: 0 }}

                                                   >

                                                       <motion.div className="transporter-infos-action"

                                                           initial={{ scale: "0", opacity: 0 }}
                                                           animate={showTransporterInfos == index ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                                                           onClick={() => {
                                                               setShowOrdersOverlay(true)
                                                           }}
                                                       >
                                                           <p>More Infos</p>
                                                           
                                                       </motion.div>

                                                       <motion.div className="transporter-infos-action"
                                                                id="select-tranps-btn"
                                                           initial={{ scale: "0", opacity: 0 }}
                                                           animate={showTransporterInfos == index && selectedOrderToUpdate != null? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                                                           onClick={() => {
                                                               setSelectTranspOverlay(true)
                                                               selectOrderTransoprter(item)
                                                           }}
                                                       >
                                                           <p>Select</p>

                                                       </motion.div>
                                                   </motion.div>
                                               </div>
                                           )
                                       })

                                       :

                                            allTransporters.map((item , index) => {
                                                return (
                                                    <div>
                                                        <div className="transporter-item">
                                                            <div className="left-transporter">
                                                                <div className="transporter-icon">
                                                                    <img src={arrow} alt="" />
                                                                </div>

                                                                <div className="transporter-text">
                                                                    <p>{item.name}</p>
                                                                    <p className="small-text">Korssa Transporter</p>
                                                                </div>
                                                            </div>

                                                            <div className="transporter-action"
                                                                onClick={() => {
                                                                    setShowTransporterInfos(index)
                                                                }}
                                                            >
                                                                <img src={actions} alt="" />
                                                            </div>

                                                        </div>

                                                        <motion.div className="transporter-infos"
                                                            initial={{ height: "0", opacity: 0 }}
                                                            animate={showTransporterInfos == index? { height: "60px", opacity: 1 } : { height: "0", opacity: 0 }}

                                                        >

                                                            <motion.div className="transporter-infos-action"

                                                                initial={{ scale: "0", opacity: 0 }}
                                                                animate={showTransporterInfos == index ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                                                                onClick={() => {
                                                                    setShowOrdersOverlay(true)
                                                                }}
                                                            >
                                                                <p>More Infos</p>

                                                            </motion.div>

                                                            <motion.div className="transporter-infos-action"
                                                                id="select-tranps-btn"
                                                                initial={{ scale: "0", opacity: 0 }}
                                                                animate={showTransporterInfos == index && selectedOrderToUpdate != null ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                                                                onClick={() => {
                                                                    setSelectTranspOverlay(true)
                                                                    selectOrderTransoprter(item)
                                                                }}
                                                            >
                                                                <p>Select</p>

                                                            </motion.div>
                                                        </motion.div>
                                                    </div>
                                                )
                                            })
                                       
                                   }
                                   

                                    

                                    
                                    
                                    

                                    
                                    
                                </div>
                            </div>
                        </div>
                    </motion.div>
    )
}


export default OrderPage;