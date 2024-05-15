import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import topImage from './topImage.jpg';
import bottomImage from './bottomImage.jpg';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { phone: '' };
  });

  const [stations, setStations] = useState(() => {
    const savedStations = localStorage.getItem('stations');
    return savedStations ? JSON.parse(savedStations) : {
      station1: false,
      station2: false,
      station3: false,
      station4: false,
      station5: false,
      station6: false,
    };
  });

  const STATION_NAMES = {
    station1: "Recycle Station",
    station2: "Drone Station",
    station3: "Visit the Grader",
    station4: "Check out the Excavator",
    station5: "Learn about TU Jobs",
    station6: "Have Lunch",
  };

  const [isRegistered, setIsRegistered] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return !!savedUser;
  });

  const query = useQuery();

  useEffect(() => {
    const stationQuery = query.get('station');
    if (stationQuery && stations.hasOwnProperty(stationQuery) && !stations[stationQuery]) {
      setStations(prevStations => {
        const updatedStations = { ...prevStations, [stationQuery]: true };
        localStorage.setItem('stations', JSON.stringify(updatedStations));
        return updatedStations;
      });
    }
  }, [query]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitting:", user, stations);
    alert('Submission successful!');

    localStorage.removeItem('user');
    localStorage.removeItem('stations');
    setUser({ phone: '' });
    setStations({
      station1: false,
      station2: false,
      station3: false,
      station4: false,
      station5: false,
      station6: false,
    });

    setIsRegistered(false);
  };

  return (
    <div className="App">
      <div className="image-container top-image-container">
        <img src={topImage} alt="Top Image" className="top-image" />
      </div>
  
      <button className="welcome-button">Welcome</button>
  
      <div className="image-container bottom-image-container">
        <img src={bottomImage} alt="Bottom Image" className="bottom-image" />
        <div className="content-overlay">
  
          {!isRegistered ? (
            <div className="form-container">
              <h2>Scavenger Hunt Registration</h2>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={user.phone}
                onChange={handleInputChange}
                required
              />
              <button type="button" onClick={() => {
                if (user.phone) {
                  localStorage.setItem('user', JSON.stringify(user));
                  setIsRegistered(true);
                }
              }}>
                Register
              </button>
            </div>
          ) : (
            <div className="stations-container">
              <div className="header">Public Works Week Scavenger Hunt</div>
              <ul className="station-list">
                {Object.keys(stations).map(station => (
                  <li key={station} className={`station-item ${stations[station] ? 'checked-station checked-animation' : ''}`}>
                    {STATION_NAMES[station]}: {stations[station] ? "✅" : "❌"}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button 
          disabled={!Object.values(stations).every(Boolean)} 
          onClick={handleSubmit} 
          className="submit-button"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default App;
