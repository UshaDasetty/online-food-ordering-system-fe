import React, { Component } from 'react'
import { Carousel } from 'react-responsive-carousel';
import queryString from 'query-string';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import Modal from 'react-modal'



import "react-responsive-carousel/lib/styles/carousel.min.css";
import 'react-tabs/style/react-tabs.css';
import '../Styles/Details.css'

const constants = require('../Constants')
const API_URL = constants.API_URL;

// copied from react-modal
const customStyles = {   
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '660px',
      maxHeight: '700px',
      zIndex: 100
    },
  };
  Modal.setAppElement('#root');

export default class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurant: null,
            isMenuModalOpen: false,
            menu:[],
            totalPrice:0

        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        // debugger
        console.log(qs)
        const {rest_id} = qs;
        

        axios.get(`${API_URL}/api/getRestaurantsById/${rest_id}`)
        .then(result => {
            // debugger
            this.setState({
                
                restaurant: result.data.restaurants
            });
           
        })
        .catch(
            error => {
                console.log(error)
            }
        );

        axios.get(`${API_URL}/api/getMenuByRestaurant/${rest_id}`)
        .then(result => {
           // debugger
            this.setState({
                
                menu: result.data.menu
            });
           
        })
        .catch(
            error => {
                console.log(error)
            }
        );
    }

    openMenuHandler = () => {
        this.setState({
            isMenuModalOpen: true
        })
    }

    closeMenuModal = () => {
        this.setState({
            isMenuModalOpen: false
        })
    }

    addItemHandler = (item) => {
        // debugger
        const {totalPrice} = this.state;
        this.setState({
            totalPrice: totalPrice + item.itemPrice
        })
    }

    getCheckSum(data) {
        return fetch(`${API_URL}/api/payment`,
        {
            method:'POST',
            headers:{
                Accept:'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        }).then(result => {
            return result.json();
        }).catch(error => {
            console.log(error)
        })
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    stringifyValue = (value) => {
        if(this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value)
        }else{
            return value;
        }
    }

    buildForm = (details) => {
        const {action, params} = details

        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action',action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type','hidden')
            input.setAttribute('name', key)
            input.setAttribute('value',this.stringifyValue(params[key]))
            form.appendChild(input)
        });
        return form;
    }

    postTheInformation = (information) => {
        // ypu can post the payment and order related information to payment gateway only through an HTML forms
        // How to create HTML forms in javascript? : using DOM Manipulation
        
        // first we will create a form then we will post the form to paytm
        const form = this.buildForm(information)

        // attach to the document body
        document.body.appendChild(form)

        // submit
        form.submit();

        // destroy the form
        form.remove()
    }

    paymentHandler = () => {
        // Payment
        // (1) Make an API call to the BackEnd  /payment and get the payment checksum
        // (2) go to the paytm website

        const data= {
            amount: this.state.totalPrice,
            email: 'usha@gmail.com',
            mobileNo: '9877765431'
        }

        this.getCheckSum(data).then(result => {
            let information ={
                action: 'https://securegw-stage.paytm.in/order/process',
                params: result 
            }
            this.postTheInformation(information)
        }).catch(error => {
            console.log(error)
        })
    }



    render() {
        const { restaurant, isMenuModalOpen, menu, totalPrice } = this.state
        return (
            <div className="container details">
                {
                    restaurant
                    ?
                    <div>
                        
                        <div className="images">
                            <Carousel showThumbs={false}>

                                {
                                    restaurant.thumb.map((item, index) => {
                                        return(
                                            <div>
                                                <img key={index} src={require('../'+item).default} alt="not found"/>
                                            </div>
                                        )
                                    })
                                }


                                {/* <div>
                                    <img src={require('../Assets/Breakfast.png').default} alt="not found"/>
                                </div>
                                <div>
                                    <img src={require('../Assets/Lunch.png').default} alt="not found"/>
                                </div>
                                <div>
                                    <img src={require('../Assets/Dinner.png').default} alt="not found"/>
                                </div> */}

                            </Carousel>
                         </div>

                        <div className="restName my-3">
                            {restaurant.name}
                            <button className="btn btn-danger float-end mt-4" onClick={this.openMenuHandler}>Place Order Online</button>
                        </div>

                        <div className="myTabs my-5">
                            <Tabs>
                                <TabList>
                                    <Tab>Overview</Tab>
                                    <Tab>Contact</Tab>
                                </TabList>

                                <TabPanel>
                                    <div className="about my-5">About this place</div>
                                    <div className="cuisine">Cuisine</div>
                                    <div className="cuisines">
                                        {
                                            restaurant.cuisine.map((item, index)=>{
                                                return <span key={index} >{item.name},</span>
                                            })
                                        }
                                    </div>
                                    <div className="cuisine mt-3">Average Cost</div>
                                    <div className="cuisines">&#8377;{restaurant.min_price} for two people(approx.)</div>
                                </TabPanel>

                                <TabPanel>
                                    <div className="cuisine my-5">Phone Number
                                        <div className="text-danger">{restaurant.contact_number}</div>
                                    </div>
                                    
                                    <div className="cuisine mt-3">{restaurant.name}</div>
                                    <div className="cuisines text-muted mt-2">
                                        {restaurant.locality},
                                        <br/>
                                        {restaurant.city}
                                    </div>
                                    
                                </TabPanel>
                            </Tabs>
                        </div>

                        <Modal isOpen={ isMenuModalOpen } style={customStyles} >
                            <h2 className="popup-heading">{restaurant.name}
                                <button className="float-end btn btn-close mt-2" onClick={this.closeMenuModal}></button>
                                <ul className="menu">
                                        {
                                            menu.map((item, index) => {
                                                return(
                                                    <li key={index}>
                                                        <div className="row no-gutters menuItem">

                                                            <div className="col-10">
                                                                {
                                                                    item.isVeg
                                                                    ?
                                                                    <div className="text-success fs-6">Veg</div>
                                                                    :
                                                                    <div className="text-danger fs-6">Non-Veg</div>
                                                                }

                                                                <div className="cuisines">{ item.itemName }</div>
                                                                <div className="cuisines">&#8377;{ item.itemPrice }</div>
                                                                <div className="cuisines">{ item.itemDescription }</div>

                                                            </div>

                                                            <div className="col-2">
                                                                <button className="btn btn-light addButton" onClick={() => this.addItemHandler(item)}>Add</button>
                                                            </div>

                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                </ul>

                                <div className="mt-3 restName fs-4">
                                    Subtotal <span className="m-4">&#8377;{totalPrice}</span>
                                    <button className="btn btn-danger float-end" onClick={this.paymentHandler}>Pay Now</button>
                                </div>
                            </h2>
                        </Modal>

                    </div>
                    
                    :
                    <div> Loading, Please wait.....!</div>
            
                    
                }
                

            </div>
        )
    }
}
