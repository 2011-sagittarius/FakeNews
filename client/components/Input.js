import React from 'react'
import {FlexCol} from '../components'

function Input({url, setUrl, clearUrl, handleClick}) {
  const click = () => {
    if (url === 'Enter URL') clearUrl()
  }

  return (
    <FlexCol className="search">
      <input
        type="text"
        className="form-control"
        aria-label="Sizing example input"
        aria-describedby="inputGroup-sizing-lg"
        value={url}
        onChange={setUrl}
        onClick={click}
      />
      <button
        className="btn btn-outline-secondary"
        type="button"
        id="button-addon2"
        onClick={handleClick}
      >
        Check
      </button>
    </FlexCol>
  )
}

export default Input
