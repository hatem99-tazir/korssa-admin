import "../styles/TransporterForm.css"

import { motion } from "framer-motion"

import React, { useState, useEffect } from 'react';


import setting from "../asstes/dashboard/setting.png"
import arrow from "../asstes/dashboard/arrow.png"

import task from "../asstes/dashboard/task.png"


import livreur from "../asstes/dashboard/livreur.png"
import order from "../asstes/dashboard/order.png"

import client from "../asstes/dashboard/client.png"

import { getDatabase, ref, set, push, get } from "firebase/database";



function StatPage({ setShowClinetDetails,setSelectedClientDetail, setChoiceTransoporter, anime,  }) {


    const [selectedStateFilter, setSelectedStateFilter] = useState(0);
    const [showSelectOption1, setShowSelect1] = useState(false);

    const initSelected = [true, true, true, true, true, true, true, true];
    const [selectedField, setSelectedField] = useState(initSelected);

    const [presAllOrders, setPresAllOrders] = useState([]);


    const [allOrders, setAllOrders] = useState([]);
    const [filterOrders, setFilterOrders] = useState([]);

    const [allTransporters, setAllTransporters] = useState([]);



    
    const [allClient, setAllClient] = useState([]);
    
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



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
        console.log(date.toString().split(" "))
        var res = { day: date.toString().split(" ")[0], date: date.toString().split(" ")[2] , month : date.toString().split(" ")[1]};
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

                        console.log("testing " + list[index][1].time_requested);

                        if (shipmentMonth == month && shipmentYear == year) {
                            result.push(list[index]);
                            console.log("testing " + list[index][1].time_requested);    
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


            if (month == 11){
                setLastMonthIncom(result)
            }

            if (month == 12) {
                setCurrentMonthIncom(result)
            }
                    console.log("Brute Income of " + month + "/" + year + ": " + result);
                    
                    return result;
                }
            

        return 0;

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

        
        console.log( "test month :" + parseInt(new Date().getMonth() + 1) );
        countWorkingCapacity()
        countOrdersSatisfiedPercent()
        countWorkers()
        countOrdersPending()
        countOrdersMonthly( parseInt(new Date().getMonth() + 1) , 2023)
        countMonthlyIncome( parseInt(new Date().getMonth() + 1) , 2023)
        countUsers()
        

        getAllTransporter()

        window.addEventListener('click', function (e) {
         

        });
    }, [])

    return (
        
        
<motion.div className="dashboard-home" id="page1"
                        initial={{opacity:1}}
                        animate={anime ? { opacity: 1,zIndex:3 } : { opacity: 0,zIndex:0 }}
                    >
                        <div className="dashboard-home-left">
                            <div className="dash-home-top">
                                <div className="dash-home-top-left">
                                    <p>Korsaa</p>
                                    <p>Dashboard</p>
                                </div>


                                <div className="dash-home-top-right">
                                    
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
                                            <p>{ getPrevDate(getPrevDate(0).date).month}</p>
                                            <p> {parseInt(lastMonthIncom)} DA</p>
                                            </div>
                                            <div className="fotter-stat">
                                            <p>Current Month</p>
                                            <p>{getPrevDate(0).month}</p>
                                            <p>{parseInt(currentMonthIncom)} DA</p>
                                            </div>
                                            <div className="fotter-stat">
                                            <p>Best Month</p>
                                            <p>Jan</p>
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
                                                    <p className="small-text">Statistics</p>
                                                    <p>{orderMonthCount} Order</p>
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

    )
}


export default StatPage;


