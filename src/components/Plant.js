import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router'
import { Button } from 'react-bootstrap';


function Plant(props) {
  // const plantURI  = props.uri
  let { plantName, plantURI } = useParams()
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [images, setImage] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3001/plants/${plantURI}`)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setImage(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])
  if (error) {
    console.log(error)
    return <div>Loading...</div>
  }
  if (!isLoaded) {
    return <div>Loading...</div>
  }
  return <>
    <div className="container" style={{
      textAlign: "center"
    }}>
      <h1 style={{
        color: "#022e0e"
      }}>Photos to Review for {plantName}</h1>
    </div>
    <div className="container">
      <ul>
        {images.map(image => {
          return <li style={{
            display: 'block'
          }} key={image.id}>
            <img src={image.url} alt="missing"/>
            <h4>ID: {image.id}</h4>
            <p>Height: {image.height}, Width: {image.width}</p>
            <div style={{padding: "4px"}}>
              <col-6 style={{padding: "4px"}}>
                <Button variant="success" onClick={() => {
                  console.log(`${image.id} for ${plantName} approved`)
                  // fetch for approval server method
                }}>Approve</Button>
              </col-6>
              <col-6 style={{padding: "4px"}}>
                <Button variant="danger" onClick={async () => {
                  console.log(`${image.id} for ${plantName} declined`)
                  await fetch(`http://localhost:3001/plants/${plantURI}/${image.id}`, {method: 'DELETE'})
                  window.location.reload()
                }}>Deny</Button >
              </col-6>
            </div>
          </li>
        })}
      </ul>
    </div>
  </>
}

export default Plant;