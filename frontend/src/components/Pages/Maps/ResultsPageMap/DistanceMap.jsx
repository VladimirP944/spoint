import React, {useEffect, useState} from 'react'
import {GoogleMap, LoadScript, Marker, Polyline} from '@react-google-maps/api';
import {Link, useLocation} from 'react-router-dom'
import haversine from 'haversine-distance'
import {MDBBtn} from "mdb-react-ui-kit";
import { atom, useAtom } from 'jotai';

export const progressAtom = atom(0);

const containerStyle = {
    width: '60%',
    height: '80vh',
};

const DistanceMap = () => {

    const location = useLocation()
    const { from } = location.state
    const [clicks, setClicks] = React.useState([]);

    const latLng1 = {lat: from.streetViewLat, lng: from.streetViewLng}
    const latLng2 = {lat: from.first.lat, lng: from.first.lng}

    const [progress1, setProgress] = useAtom(progressAtom);

    const famousPlaceProgressURL = 'http://localhost:8080/api/progress/update/1/famous';
    const [famousPlaceProgress, setfamousPlaceProgress] = useState(null);

    function updateProgress() {
        setProgress(number => number + 1);

        async function fetchData() {
            await fetch(famousPlaceProgressURL)
                .then(res => {
                    return res.json();
                }).then(data => {
                    setfamousPlaceProgress(data);
                    console.log(data + "in famous")

                })
        }
        fetchData();

    }


    return (
        <div >
            <div style={{display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'}}>
                <LoadScript googleMapsApiKey={""}>
                    <GoogleMap
                        options={{disableDefaultUI: true}}
                        mapContainerStyle={containerStyle}
                        className={"map"}
                        zoom={2.4}
                        defaultOptions={{mapTypeControl: false}}
                        center={latLng1}
                    >
                        { /* Child components, such as markers, info windows, etc. */ }
                        {/*{clicks.map((latLng, i) => (<Marker key={i} position={latLng} />))}*/}
                        <Marker key={0} position={latLng1} />
                        <Marker key={1} position={latLng2} />
                        // Draw a line showing the straight distance between the markers
                        <Polyline
                            path={[latLng1, latLng2]}
                            geodesic={true}
                            options={{
                                strokeColor: "#ff2527",
                                strokeOpacity: 2,
                                strokeWeight: 5,
                                icons: [
                                    {
                                        icon: "lineSymbol",
                                        offset: "0",
                                        repeat: "20px"
                                    }
                                ]
                            }}
                        />
                    </GoogleMap>
                </LoadScript>
            </div>
            <div style={{backgroundColor: "blue",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'}}>
                <h1>DISTANCE: {Math.round(haversine(latLng1, latLng2) / 1000)} KM</h1>
            </div>
            <div>
                <Link to="/guess">
                    <MDBBtn rounded color='warning' onClick={updateProgress}>Go to next round! </MDBBtn>
                </Link>
            </div>
            <div>
                <Link to="/gameplay">
                    <MDBBtn rounded color='warning'>Close game!</MDBBtn>
                </Link>
            </div>
        </div>
    )
}

export default DistanceMap;
