import React from 'react'
import {Route, Switch} from 'react-router-dom'
import {Scraper} from './components'

/**
 * COMPONENT
 */
const Routes = () => {
  return (
    <Switch>
      {/* Routes placed here are available to all visitors */}
      <Route exact path="/" component={Scraper} />
    </Switch>
  )
}

export default Routes
