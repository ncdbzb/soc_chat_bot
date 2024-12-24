import React from "react";
import { Link } from 'react-router-dom';
import { useGetLeaderboardMeQuery } from "../../../store/services/contest";

const Leaderboard = () => {
  const {data: isData, isLoading } = useGetLeaderboardMeQuery()
  if (isLoading) {
    return <div>Загрузка данных...</div>;
  }
  const leaderboardData = Object.values(isData).map(({ doc_name, leaderboard }) => ({
    doc_name,
    leaderboard,
  }));

  return (
    <>
      {leaderboardData.map(({ doc_name, leaderboard }, index) => (
        leaderboard.length > 0 && (
          <div key={index} className="container_leaderboard">
            <h2>Рейтинг по документации {doc_name}</h2>
            <table className="table-leaderboard">
              <thead>
                <tr>
                  <th>Место</th>
                  <th>Имя</th>
                  <th>Очки</th>
                  <th>Пройдено</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((participant, idx) => (
                  <tr key={idx}>
                    <td>{participant.place}</td>
                    <td>{participant.surname} {participant.name}</td>
                    <td>{participant.points}</td>
                    <td>{participant.total_tests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link className='link-leaderboard' to={`/leaderboard/${doc_name}`}>Полный рейтинг</Link>
          </div>
        )
      ))}
    </>
  );
};

export default Leaderboard;
