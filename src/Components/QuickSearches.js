import React, { Component } from 'react'
import QuickSearch from './QuickSearch'

export default class QuickSearches extends Component {
    render() {
        const {quicksearches} = this.props
        return (
            <>

            <div className="row">
                    <div className="col-12">
                        <div className="QSheader">
                            Quick Searches
                        </div>

                        <div className="subheading">
                            Discover restaurants by type of meal
                        </div>
                    </div>
            </div>

            <div className="container">
                <div className="qs row">

                    {
                        quicksearches.map(( item, index) => {
                            return <QuickSearch key={index} image={require('../'+item.image).default} title= {item.name} description={item.content} mealType={item.meal_type}/>
                        })
                    }

                    {/* <QuickSearch image={require('../Assests/Breakfast.png').default} title= {'Breakfast'}/>
                    <QuickSearch image={require('../Assests/Lunch.png').default} title= {'Lunch'}/>
                    <QuickSearch image={require('../Assests/Dinner.png').default} title= {'Dinner'}/>
                    <QuickSearch image={require('../Assests/Snacks.png').default} title= {'Snacks'}/>
                    <QuickSearch image={require('../Assests/Drinks.png').default} title= {'Drinks'}/>
                    <QuickSearch image={require('../Assests/Nightlife.png').default} title= {'Nightlife'}/> */}
                
                </div>
            </div>
	
            </>
        )
    }
}
