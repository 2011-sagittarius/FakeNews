import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {useSpring, animated} from 'react-spring'
import Landing from '../SVG/LandingPerson'
import LandingStars from '../SVG/LandingStars'
import LandingIcons from '../SVG/LandingIcons'
import LandingSpeechBubbles from '../SVG/LandingSpeechBubbles'
import LandingBackground from '../SVG/LandingBackground'
import LandingPosts from '../SVG/LandingPosts'
import './LandingParallax.css' // // Icons made by Freepik from www.flaticon.com

const person = encodeURIComponent(renderToStaticMarkup(<Landing />))
const stars = encodeURIComponent(renderToStaticMarkup(<LandingStars />))
const icons = encodeURIComponent(renderToStaticMarkup(<LandingIcons />))
const posts = encodeURIComponent(renderToStaticMarkup(<LandingPosts />))
const background = encodeURIComponent(
  renderToStaticMarkup(<LandingBackground />)
)
const speechBubbles = encodeURIComponent(
  renderToStaticMarkup(<LandingSpeechBubbles />)
)

const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2]
const trans1 = (x, y) => `translate3d(${x / 10}px,${y / 10}px,0)`
const trans2 = (x, y) => `translate3d(${x / 8 + 35}px,${y / 8 - 230}px,0)`
const trans3 = (x, y) => `translate3d(${x / 2}px,${y / 2}px,0)`
const trans4 = (x, y) => `translate3d(${x / 14}px,${y / 14}px,0)`
const trans5 = (x, y) => `translate3d(${x / 4}px,${y / 4}px,0)`
const trans6 = (x, y) => `translate3d(${x / 12}px,${y / 12}px,0)`

function Card() {
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: {mass: 10, tension: 550, friction: 140}
  }))
  return (
    <div
      className="container"
      onMouseMove={({clientX: x, clientY: y}) => set({xy: calc(x, y)})}
    >
      <animated.div
        className="card1"
        style={{
          transform: props.xy.interpolate(trans1),
          backgroundImage: `url('data:image/svg+xml;utf8, ${person}')`
        }}
      />
      <animated.div
        className="card2"
        style={{
          transform: props.xy.interpolate(trans2),
          backgroundImage: `url('data:image/svg+xml;utf8, ${stars}')`
        }}
      />
      <animated.div
        className="card3"
        style={{
          transform: props.xy.interpolate(trans3),
          backgroundImage: `url('data:image/svg+xml;utf8, ${icons}')`
        }}
      />
      <animated.div
        className="card4"
        style={{
          transform: props.xy.interpolate(trans4),
          backgroundImage: `url('data:image/svg+xml;utf8, ${background}')`
        }}
      />
      <animated.div
        className="card5"
        style={{
          transform: props.xy.interpolate(trans5),
          backgroundImage: `url('data:image/svg+xml;utf8, ${speechBubbles}')`
        }}
      />
      <animated.div
        className="card5"
        style={{
          transform: props.xy.interpolate(trans6),
          backgroundImage: `url('data:image/svg+xml;utf8, ${posts}')`
        }}
      />
      {/* <animated.div
        className="card3"
        style={{transform: props.xy.interpolate(trans3)}}
      />
      <animated.div
        className="card4"
        style={{transform: props.xy.interpolate(trans4)}}
      /> */}
    </div>
  )
}

export default Card
