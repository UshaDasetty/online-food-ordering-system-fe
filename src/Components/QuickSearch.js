import React, { Component } from 'react'
import { withRouter } from 'react-router'

 class QuickSearch extends Component {

    handleClick = (mealtypeName, mealTypeId) => {
        this.props.history.push(`/filter?mealType=${mealtypeName}&mealTypeId=${mealTypeId}`)
    }
    render() {
        const{image, title, description, mealType} = this.props;
        return (
            <>
            
            
    

                    <div className="qs-box col-12 col-sm-12 col-md-6 col-lg-4" onClick={() => this.handleClick(title, mealType)} style={{cursor:'pointer'}}>
                        <div className="qs-box-item">
                            <img src={image} alt="not found" width="160px" height="160px"/>
                            <h4>{title}</h4>
                            <p>{description}</p>
                        </div>
                    </div>
                    
            
        
	
            </>
        )
    }
}

export default withRouter(QuickSearch)
