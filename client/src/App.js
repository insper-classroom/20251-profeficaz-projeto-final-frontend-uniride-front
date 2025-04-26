import React, { useState, useEffect } from 'react'

function App() {

  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/membros").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  return (
    <div>

      {(typeof data.membros === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        data.membros.map((membro, i) => (
          <p key={i}>{membro}</p>
        ))
      )}

    </div>
  )
}

export default App