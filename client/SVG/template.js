import React from 'react'
import '../components/Landing.css'

function LandingStars() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="animated"
      version="1.1"
      viewBox="0 0 500 500"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="active" height="200%">
          <feMorphology
            in="SourceAlpha"
            operator="dilate"
            radius="2"
            result="DILATED"
          />
          <feFlood floodColor="#32DFEC" floodOpacity="1" result="PINK" />
          <feComposite in="PINK" in2="DILATED" operator="in" result="OUTLINE" />
          <feMerge>
            <feMergeNode in="OUTLINE" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="hover" height="200%">
          <feMorphology
            in="SourceAlpha"
            operator="dilate"
            radius="2"
            result="DILATED"
          />
          <feFlood floodColor="red" floodOpacity="0.5" result="PINK" />
          <feComposite in="PINK" in2="DILATED" operator="in" result="OUTLINE" />
          <feMerge>
            <feMergeNode in="OUTLINE" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
          <feColorMatrix values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" />
        </filter>
      </defs>
    </svg>
  )
}

export default LandingStars
