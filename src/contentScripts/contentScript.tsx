import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './contentScript.css';

import NBATeams from '../lib/teams';
import Title from '../pages/Title';

const App: React.FC<{}> = () => {
  const teamsList = [];
  const [foundCheaper, setFoundCheaper] = useState(false);
  const [props, setProps] = useState('');
  useEffect(() => {
    const s: string = document.body.innerText;
    for (const team of NBATeams) {
      if (s.includes(team)) {
        teamsList.push(team);
        if (teamsList.length == 2) {
          setFoundCheaper((foundCheaper) => true);
          fetch('http://localhost:6969/find-tickets', {
            headers: {
              team1: teamsList[0],
              team2: teamsList[1],
            },
          })
            .then((res) => res.json())
            .then((data) => setProps((props) => data.message))
            .catch((err) => {
              console.log('Error:', err);
            });
          break;
        }
      }
    }
  }, []);
  if (foundCheaper) {
    return (
      <div id='spotlight'>
        <Title />
        <h2>{props.toString()}</h2>
      </div>
    );
  }
  return (
    <div id='spotlight'>
      <h1>Could not find cheaper tix 🙏🙏</h1>
    </div>
  );
};

const div = document.createElement('div');
document.body.appendChild(div);

const root = createRoot(div);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('rendered popup!');
