import React from 'react';
import './leaderboard.css';
import { useGetLeaderboardQuery } from '../../store/services/contest';
import { useVerifyUserQuery } from '../../store/services/auth';
function Leaderboard({ data }) {
  const { data: userData, status, isLoading, error } = useGetLeaderboardQuery(data)
  if (isLoading) {
    return <h1>Ещё никто не участвовал</h1>;
  }
  else if (error) {
    return <h1>При разгрузке рейтинга произошла ошибка, перезагрузите страницу</h1>;
  }

  return (
    <section className='leaderboard_page'>
      <div className="container_leaderboard">

        <h1>Рейтинг по документации {data}</h1>
        <table className="table-leaderboard">
          <thead>
            <tr>
              <th>Место</th>
              <th>Фамилия</th>
              <th>Имя</th>
              <th>Кол-во пройденных тестов</th>
              <th>Кол-во очков</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((item) => (
              <tr key={item.id}>
                <td>{item.place}</td>
                <td>{item.surname}</td>
                <td>{item.name}</td>
                <td>{item.total_tests}</td>
                <td>{item.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Leaderboard;