import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';


// Helper function to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const [user, setUser] = useState(() => {
    // Retrieve user data from local storage if available
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { name: '', school: '' };
  });
  const [stations, setStations] = useState(() => {
    // Retrieve station check-ins from local storage if available
    const savedStations = localStorage.getItem('stations');
    return savedStations ? JSON.parse(savedStations) : {
      station1: false,
      station2: false,
      station3: false,
      station4: false,
      station5: false,
      station6: false,
      // Add more stations as necessary
    };
  });

  const STATION_NAMES = {
    station1: "Recycle Station",
    station2: "Drone Station",
    station3: "Visit the Grader",
    station4: "Check out the Excavator",
    station5: "Learn about TU Jobs",
    station6: "Have Lunch",
    // Add more mappings as necessary
  };

  const [isRegistered, setIsRegistered] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return !!savedUser;  // Convert to boolean: true if user exists
  });
  const query = useQuery();

  useEffect(() => {
    // Detect station from URL query and update state
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
    // Persist user data in local storage
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = () => {
    // Submission logic to backend or Google Sheets
    console.log("Submitting:", user, stations);
    alert('Submission successful!');

    // Optionally clear local storage and state after submission
    localStorage.removeItem('user');
    localStorage.removeItem('stations');
    setUser({ name: '', school: '' });
    setStations({
      station1: false,
      station2: false,
      station3: false,
      station4: false,
      station5: false,
      station6: false,
      // Reset more stations as needed
    });

    setIsRegistered(false); // Reset registration status
  };

  return (
    <div className="App">
         <div className="header">
                Public Works Week Scavenger Hunt
            </div>
            
      {!isRegistered ? (
        <div>
          <h2>Scavenger Hunt Registration</h2>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={user.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="school"
            placeholder="Enter your school name"
            value={user.school}
            onChange={handleInputChange}
            required
          />
          <button type="button" onClick={() => {if (user.name && user.school) {
        localStorage.setItem('user', JSON.stringify(user));
        setIsRegistered(true);
    }}}>
            Register
          </button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.name} from {user.school}!</h2>
          <ul className="station-list">
  {Object.keys(stations).map(station => (
    <li key={station} className={`station-item ${stations[station] ? 'checked-station checked-animation' : ''}`}>
      {STATION_NAMES[station]}: {stations[station] ? "✅ Checked" : "Not Checked"}
    </li>
  ))}
</ul>
          {Object.values(stations).every(Boolean) && (
            <button onClick={handleSubmit}>
              Submit Completion
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
