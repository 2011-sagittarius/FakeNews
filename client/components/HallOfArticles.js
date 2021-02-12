import React from 'react'

const HallOfArticles = ({hallOfFame, hallOfShame}) => {
  let fameData = hallOfFame
  let shameData = hallOfShame
  console.log(fameData)
  console.log(shameData)

  return (
    <div>
      <h2>Hall of Fame</h2>
      <ul>
        {Object.keys(fameData).map((publisher, index) => (
          <li key={index}>
            {publisher}: {fameData[publisher]}
          </li>
        ))}
      </ul>

      <h2>Hall of Shame</h2>
      <ul>
        {Object.keys(shameData).map((publisher, index) => (
          <li key={index}>
            {publisher}: {shameData[publisher]}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HallOfArticles
