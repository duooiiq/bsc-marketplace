import './styles/globals.css'
import './App.css'
import CreateItem from './create-item.js'
import CreatorDashboard from './creator-dashboard.js'
import Home from './market.js'
import MyAssets from './my-assets.js'
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function App() {
  return (
    <Router>
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Metaverse Marketplace</p>
        <div className="flex mt-4">
          <Link to="/">
            <a className="mr-4 text-pink-500">
              <img src="https://i.ibb.co/yW7xX4r/1639580476361.png" alt="Logo" className="logo" />
            </a>
          </Link>
          <Link to="/create">
            <a className="mr-6 text-pink-500">
              Sell Digital Asset
            </a>
          </Link>
          <Link to="/profile">
            <a className="mr-6 text-pink-500">
              My Digital Assets
            </a>
          </Link>
          <Link to="/dashboard">
            <a className="mr-6 text-pink-500">
              Creator Dashboard
            </a>
          </Link>
        </div>
      </nav>
    </div>
    <Switch>
    <Route path="/create">
<CreateItem />
</Route>
    <Route path="/dashboard">
<CreatorDashboard />
</Route>
    <Route path="/profile">
<MyAssets />
</Route>
    <Route path="/">
<Home />
</Route>
</Switch>
</Router>
  )
}
