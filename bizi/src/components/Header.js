import React from 'react'
import Nav from './Nav'
import LightLogo from '../images/lightLogo.jpg'
import sustain from '../images/environment.png'
import ethical from '../images/heart_hand.png'
import diversity from '../images/community.png'
import { Link, withRouter } from 'react-router-dom'

class Header extends React.Component {

    constructor(props){
      super(props);
      this.state={
        search: "",
        filters: []
      };
      this.searchChange = this.searchChange.bind(this);
    }
  
    searchChange(e){
      this.setState({search: e.target.value});
    }

    filterClick(fil) {
      const { filters } = this.state;
      var currFilters = filters.slice();
      currFilters.includes(fil) ?
        currFilters.splice(currFilters.indexOf(fil), 1) :
        currFilters.push(fil);
      this.setState({filters: currFilters});
    }
  
    render (){
      const { search, filters } = this.state;
      console.log(filters);
      return (
      <div id="header">
        <Nav light={true} />
        <div className="header-content">
          <img src={LightLogo} className="headerLogo" />        
          <div className="header-tags">
            {/* <Link to={{pathname: "/search", state: {initialFilter: 'Sustainable'}}} className="header-tag">
              <img src={sustain} />
              <h3>Sustainability</h3>
            </Link>
            <Link to={{pathname: "/search", state: {initialFilter: 'Supply Chain'}}} className="header-tag">
              <img src={ethical} /> 
              <h3>Ethical Supply Chain</h3>
            </Link>
            <Link to={{pathname: "/search", state: {initialFilter: 'Diversity Focused'}}} className="header-tag">
              <img src={diversity} />
              <h3>Diversity Initiatives</h3>
            </Link> */}
            <div className='header-tag' id={filters.includes("Sustainable") && 'filter-highlighted'} onClick={() => this.filterClick("Sustainable")}>
              <img src={sustain} />
              <h3>Sustainability</h3>
            </div>
            <div className='header-tag' id={filters.includes("Supply Chain") && 'filter-highlighted'} onClick={() => this.filterClick("Supply Chain")}>
              <img src={ethical} />
              <h3>Ethical Supply Chain</h3>
            </div>
            <div className='header-tag' id={filters.includes("Diversity Focused") && 'filter-highlighted'} onClick={() => this.filterClick("Diversity Focused")}>
              <img src={diversity} />
              <h3>Diversity Initiatives</h3>
            </div>
          </div>          
          <fieldset>
            <input type="text" id="searchbar" placeholder="Search businesses near you" value={this.state.search} onChange={this.searchChange}/>
            <button type="submit" onClick={() => this.props.history.push({pathname: '/search', state: {initialSearch: search, initialFilters: filters}})}>let's go!</button>
          </fieldset>      
        </div>
      </div>
    );}
  }

export default withRouter(Header);