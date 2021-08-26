import React, { Component } from 'react'
import '../Styles/Filters.css';
import queryString from 'query-string'
import axios from 'axios'
import { withRouter } from 'react-router-dom'

const constants = require('../Constants')
const API_URL = constants.API_URL;

class Filter extends Component {

    constructor(){
        super();
        this.state={
            mealType: '',
            mealTypeId: 0,
            locations: [],
            selectedCityName: '',
            locationsInCity: [],
            selectedLocation: '',
            pageNo: 1,
            restaurantLists: [],
            totalResults: 0,
            noOfPages: 0,
            cuisines: [],
            hcost: undefined,
            lcost: undefined,
            sortOrder: 1
        }
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const {mealType, mealTypeId} = qs;
        this.setState({
            mealType: mealType,
            mealTypeId: mealTypeId
        })
        const city_id = localStorage.getItem('city_id')

        // get List of Locations and Filter By city_id

        axios.get(`${API_URL}/api/getAllLocations`)
        .then(result => {
           // debugger
            const locations = result.data.locations;
            //debugger
            const selectedCity = locations.find(city => city.city_id == city_id);
            const selectedCityLocations = locations.filter(city => city.city_id == city_id);
            this.setState({
                locations: result.data.locations,
                selectedCityName: selectedCity.city,
                locationsInCity: selectedCityLocations,
                selectedLocation: selectedCityLocations[0].location_id
            });
            
            setTimeout(() => {
                this.filterRestaurants();
            },0);
        })
        .catch(
            error => {
                console.log(error)
            }
        );

    }

    handleLocationChange(e) {
        const location_id = e.target.value;
        this.setState({
            selectedLocation: location_id
        });
        setTimeout(() => {
            this.filterRestaurants();
        },0);
    }

    handleCuisineChange(e, cuisine) {
        let {cuisines} = this.state;
        const index = cuisines.indexOf(cuisine);
        if(index < 0 && e.target.checked){
            cuisines.push(cuisine);
        }else{
            cuisines.splice(index, 1);
        }
        this.setState({
            cuisines:cuisines
        });
        setTimeout(() => {
            this.filterRestaurants();
        },0);

    }

    handleCostChange(e, lcost, hcost) {
        this.setState({
            hcost: hcost,
            lcost: lcost
        });
        setTimeout(() => {
            this.filterRestaurants();
        },0);

    }

    handleSort(e, direction) {
        this.setState({
            sortOrder: direction
        });
        setTimeout(() => {
            this.filterRestaurants();
        },0);

    }

    handlePageChange(pageno) {
        if(pageno < 1) return;
        this.setState({
            pageNo: pageno
        });
        setTimeout(() => {
            this.filterRestaurants();
        },0);

    }

    filterRestaurants() {
        const { mealTypeId, selectedLocation, pageNo, cuisines, hcost, lcost, sortOrder } = this.state;

        // make filter API call to filter the restaurants
        const req = {
            mealtype: mealTypeId,
            location: selectedLocation,
            page: pageNo

        }

        if(cuisines.length > 0) {
            req.cuisine = cuisines
        }

        if(hcost != undefined && lcost != undefined) {
            req.lcost = lcost
            req.hcost = hcost
        }

        if(sortOrder != undefined){
            req.sort = sortOrder
        }

        axios({
            method: 'POST',
            url: `${API_URL}/api/filterRestaurants`,
            headers: {'Content-Type': 'application/json'},
            data: req
        }).then(result => {
            //debugger
            const totalResults = result.data.totalResultsCount;
            const pageSize = result.data.pageSize;
            const noOfPages = Math.floor((totalResults/pageSize));
            this.setState({
                pageNo: result.data.pageNo,
                restaurantLists: result.data.restaurants,
                totalResults: result.data.totalResultsCount,
                noOfPages: result.data.pageSize
            });
        }).catch(error => {
            console.log(error)
        })


    }

    goToRestaurant(item) {
        const url = `/details?id=${item._id}`
        this.props.history.push(url)
    }

    getPages = () => {
        //debugger
        const {noOfPages} = this.state
        let pages = [];
        for (let i=0; i< noOfPages; i++){
            pages.push(<div key={i} onClick={() => this.handlePageChange(i+1)} className="Pagination-btn">{i+1}</div>)
        }
        return pages;
    }

    navigateToRestaurant= (rest) => {
        this.props.history.push(`/details?rest_id=${rest._id}`)
    }

    render() {
        const { mealType, locationsInCity, selectedCityName, restaurantLists, pageNo, noOfPages } = this.state;
        console.log(locationsInCity)
        let currPage = pageNo
        return (
            <React.Fragment>
                <div className="container-fluid no-padding filter-layout">
                <div className="container">
                    <div className="heading">
                        {mealType} Places in {selectedCityName}
                    </div>
                    <div className="row">   

                        <div className="leftSection col-xl-3 col-lg-4 col-md-5 col-sm-"> 
                            <div className="filterSection">
                                <div className="filter-heading">Filters</div>

                                <div className="filter-subheading">Select Location</div>
                                <select className="filter-location" onChange={(e)=>this.handleLocationChange(e)}>
                                    
                                    {
                                        locationsInCity.map((item,index) => {
                                            return <option key={index} value={item.location_id}>{item.name}</option>
                                        })
                                    }

                                    {
                                    /* <option disabled selected>Select Location</option>
                                    <option>Mumbai</option>
                                    <option>Chennai</option>
                                    <option>Banglore</option>
                                    <option>Delhi</option> */}
                                </select>

                                <div className="filter-subheading">Cuisine</div>
                                <input type="checkbox" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "North Indian")} className="filter-input"/>North Indian<br/>
                                <input type="checkbox" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "South Indian")} className="filter-input"/>South Indian<br/>
                                <input type="checkbox" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "Chinese")} className="filter-input"/>Chinese<br/>
                                <input type="checkbox" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "Fast food")} className="filter-input"/>Fast food<br/>
                                <input type="checkbox" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "Street food")} className="filter-input"/>Street food<br/>

                                <div className="filter-subheading">Cost For Two</div>
                                <input type="radio" name="cost" onChange={(e)=>this.handleCostChange(e, 0, 500)} className="filter-input"/>Less than &#8377;500<br/>
                                <input type="radio" name="cost" onChange={(e)=>this.handleCostChange(e, 500, 1000)} className="filter-input"/>&#8377;500 to &#8377;1000<br/>
                                <input type="radio" name="cost" onChange={(e)=>this.handleCostChange(e, 1000, 1500)} className="filter-input"/>&#8377;1000 to &#8377;1500<br/>
                                <input type="radio" name="cost" onChange={(e)=>this.handleCostChange(e, 1500, 2000)} className="filter-input"/>&#8377;1500 to &#8377;2000<br/>
                                <input type="radio" name="cost" onChange={(e)=>this.handleCostChange(e, 2000, 100000)} className="filter-input"/>&#8377;2000+<br/>

                                <div className="filter-subheading">Sort</div>
                                <input type="radio" name="sort" onChange={(e) => this.handleSort(e, 1 )} className="filter-input"/>Price Low to High<br/>
                                <input type="radio" name="sort" onChange={(e) => this.handleSort(e, -1)} className="filter-input"/>Price High to Low<br/>
                            </div>
                        </div>
                      


                        <div className="rightSection col-xl-9 col-lg-8 col-md-7"> 
                            <div className="resultSection">
                                    {
                                        restaurantLists.length > 0
                                        ?
                                        restaurantLists.map((item, index) => {
                                            return(
                                                <div key={index} className="result" onClick={()=>this.navigateToRestaurant(item) }>

                                                <div className="result-top row">
                                                    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-4">
                                                        <img src={require('../Assets/Breakfast.png').default} alt="not found" className="result-image"/>
                                                    </div>

                                                    <div className="col-xl-10 col-lg-9 col-md-8 col-sm-8 col-8">
                                                        <div className="result-header">{item.name}</div>
                                                        <div className="result-subheading">{item.locality}</div>
                                                        <div className="result-address">{item.city}</div>
                                                    </div>
                                                </div>

                                                <hr/>

                                                <div className="result-bottom row">
                                                    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-4">
                                                        <div className="result-details">CUISINES:</div>
                                                        <div className="result-details">COST FOR TWO:</div>
                                                    </div>
                                                    <div className="col-xl-10 col-lg-9 col-md-8 col-sm-8 col-8">
                                                        <div className="result-value">
                                                            {
                                                                item.cuisine.map((c,i) => {
                                                                    return `${c.name},`
                                                                })
                                                            }
                                                        </div>
                                                        <div className="result-value">&#8377;{item.min_price}</div>
                                                    </div>
                                                </div>

                                                </div>
                                            )
                                        })
                                        :
                                        <div className="text-danger text-center my-5">Restaurants Not Found</div>
                                    }

                                    {
                                        restaurantLists.length > 0
                                        ?
                                        <div className="Pagination">
                                            <div className="Pagination-btn" onClick={() => this.handlePageChange(--currPage)}> &#8592; </div>
                                                {
                                                    this.getPages()
                                                }
                                            <div className="Pagination-btn" onClick={() => this.handlePageChange(++currPage)}> &#8594; </div>
                                        </div>
                                        :
                                        null
                                    }

                            </div>
                        </div>   
                    </div>   

                    </div>   
		        </div>
            </React.Fragment>
        )
    }
}

export default withRouter(Filter)
