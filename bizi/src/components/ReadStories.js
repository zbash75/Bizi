import React from 'react'
import { Link } from "react-router-dom";
import { API, Storage } from 'aws-amplify';
import * as queries from '../graphql/queries';
import Loader from 'react-loader-spinner';
import busImg1 from '../images/pexels-andrea-piacquadio-3932730.jpg';
import busImg2 from '../images/pexels-rfstudio-4177755.jpg';
import busImg3 from '../images/pexels-justin-l-4060881.jpg';
import hands from '../images/hands.jpg';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

var width = window.innerWidth;

class ReadStories extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      storiesLoading: false,
      storyBusinesses: [],
      tiles: []
    }
  }

  getStories = async() => {
    this.setState({storiesLoading: true});
    try {
      var businessQuery = await API.graphql({
        query: queries.listBusinesss,
        variables: {limit: 1000}
      });
      console.log(businessQuery);
      var listStories = businessQuery?.data?.listBusinesss?.items?.filter(item => item?.story);
      console.log(listStories);
      this.setState({
        storyBusinesses: listStories
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  getImgUrl = async(path) => {
    try {
      var url = await Storage.get(path,
        { level: 'public' });
        return url;
      }
    catch(e) {
      console.log(e);
    }
  }

  createSampleText = (text) => {
    return text.substring(0, 150) + "...";
  }


  generateTiles = async() => {
    const { storyBusinesses, storyModal } = this.state;
    var businesses = [];
    console.log(storyBusinesses);
    if (storyBusinesses.length > 3) {
      var randInd = Math.floor(Math.random() * storyBusinesses.length);
      for (var i = randInd; i < randInd + 3; i++) {
        businesses.push(storyBusinesses[i % storyBusinesses.length]);
      }
    }
    else {
      businesses = storyBusinesses.slice();
    }

    var storyTiles = await Promise.all(businesses.map(async(business) => {
      var coverImg = await this.getImgUrl(business?.story?.storyImg1);
      return (
        <div>
          <img src={coverImg}/>
          <h2>{business?.businessName}</h2>
          <p id={businesses.length == 1 && 'story-margin'}>{business?.story?.storySlide1}</p>
        </div>
    )}));
    console.log(businesses);
    this.setState({
      storiesLoading: false,
      tiles: storyTiles
    });
  }

  async componentDidMount() {
    await this.getStories();
    this.generateTiles();
  }

  render() {
    const { tiles, storiesLoading } = this.state;

    if(width >  768){
      return (
        <div className='read-stories'>
          <div>
            <h1>Read Business Stories</h1>
          </div>
          <div className='bus-cols'>
            {storiesLoading ? 
              <Loader type='TailSpin' color='#385FDC' height={40}/> :
              <>
                {tiles.length > 0 ?
                  <>{tiles}</> :
                  <h1>There are currently no stories, but check back soon!</h1>
                }
              </>
            }
          </div>
          <div className='read-more-col'>
            <div className='read-more-hands'>
              <img src={hands}/>
              <Link to='/stories'><h2>Read More</h2></Link>
            </div>
          </div>    
        </div>
      );
    } 
    else{
      return(
        <>
          <div className='read-stories'>
            <div>
              <h1>Read the Stories of Businesses you Love</h1>
            </div>  
          

            <div className='bus-cols'>
              {/* <Carousel autoPlay>
                <div>
                  <img alt="" src="http://lorempixel.com/output/cats-q-c-640-480-10.jpg" />
                  <p className="legend">Legend 10</p>
                </div>
                <div>
                  <img alt="" src="http://lorempixel.com/output/cats-q-c-640-480-1.jpg" />
                  <p className="legend">Legend 1</p>
                </div>
              </Carousel> */}
              {storiesLoading ? 
                <Loader type='TailSpin' color='#385FDC' height={40}/> :
                <>
                  {tiles.length > 0 ?
                    <Carousel showStatus={false} showArrows={false} showIndicators={false} autoPlay infiniteLoop interval={5000} swipeable={false}>
                      <div>{tiles[0]}</div>
                      <div>{tiles[1]}</div>
                      <div>{tiles[2]}</div>
                    </Carousel> :
                    <h1>There are currently no stories, but check back soon!</h1>
                  }
                </>
              }
            </div>
              <fieldset> 
              <Link to="/stories" ><button>Read More</button></Link>
              </fieldset>
           
            {/* <div className='read-more-col'>
              <Link to='/stories'><h2 className="readMore">Read More</h2></Link>
            </div> */}
          </div>
        </>
      );
    }
    
  }
}

export default ReadStories