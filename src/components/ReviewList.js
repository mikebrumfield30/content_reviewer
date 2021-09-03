import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';


function ReviewList() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3001/plants")
          .then(res => res.json())
          .then(
            (result) => {
              setIsLoaded(true);
              setItems(result);
            },
            (error) => {
              setIsLoaded(true);
              setError(error);
            }
          )
      }, [])
    return <>
        <div className="container" style={{
            textAlign: "center"
        }}>
            <h1 style={{
                color: "#022e0e"
            }}>Plants to Review</h1>
        </div>
        <div className="container">
            <ul>
                {items.map(plant => {
                    return <li style={{
                        display: 'block'
                    }} key={plant}>
                        <Link to={`/plants/${plant}`}><h4>{plant}</h4></Link>
                    </li>
                })}
            </ul>
        </div>
    </>
}

export default ReviewList;