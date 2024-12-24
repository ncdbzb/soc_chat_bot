import React from 'react';
import Header from '../components/layout/main/header/Header.jsx';
import Leaderboard from '../components/layout/leaderboard/Leaderboard.jsx';
const LeaderboardDatapkPage = (props) => {
    return (
        <div>
            <Header />
            <Leaderboard data={props.data}/>
        </div>
    );
}

export default LeaderboardDatapkPage;