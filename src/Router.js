import {Route, BrowserRouter} from 'react-router-dom'

import React, { Component } from 'react'

import Home from './Components/Home'
import Filter from './Components/Filter'
import Details from './Components/Details'
import Header from './Components/Header'


export default class Router extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>

                    <Header/>
                    <Route exact path="/" component = {Home}/>
                    <Route path="/home" component = {Home}/>
                    <Route path="/filter" component = {Filter}/>
                    <Route path="/details" component = {Details}/>
                    
                </BrowserRouter>
            </div>
        )
    }
}
