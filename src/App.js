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
import ItemPage from './itemPage'
import { useEffect, useState } from 'react'
import {
  nftaddress, nftmarketaddress
} from './config'
import { ethers } from 'ethers'
import axios from 'axios'
import NotFound from './404'

import NFT from './artifacts/contracts/NFT.sol/NFT.json'
import Market from './artifacts/contracts/Market.sol/NFTMarket.json'

export default function App() {

const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])

async function loadNFTs() {
  const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/")
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
  const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
  const data = await marketContract.fetchMarketItems()
  
  const items = await Promise.all(data.map(async i => {
    const tokenUri = await tokenContract.tokenURI(i.tokenId)
    const meta = await axios.get(tokenUri)
    let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    let item = {
      price,
      itemId: i.itemId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    }
    return item
  }))
  setNfts(items)
  setLoadingState('loaded') 
}


  return (
    <div className="flex justify-center">
    <div className="px-4" style={{ maxWidth: '1600px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <center>
        {
           nfts.map((nft, i) => (

    <Router key={i}>
            <div key={i} className="border shadow rounded-xl overflow-hidden">
      <nav className="border-b p-6">
        <b>
        <p className="text-4xl font-bold">Metaverse Marketplace</p>

        <div className="linksBar">
          <Link to="/" className='aLink'>
              <img src="https://i.ibb.co/yW7xX4r/1639580476361.png" alt="Logo" className="logo" />
          </Link>
          <Link to="/create" className='aLink'>
          Sell Digital Assets
          </Link>
          <Link to="/profile" className='aLink'>
             My Digital Assets
          </Link>
          <Link to="/dashboard" className='aLink'>
              Creator Dashboard
          </Link>
        </div>
        </b>
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
    <Route path={ "/nft/tokenId/" + nft.itemId }>
        <ItemPage />
    </Route>
    <Route path="/" exact>
<Home />
</Route>
<Route component={NotFound} />
</Switch>
</Router>
  )
  )
    }
    </center>
    </div>
    </div>
    </div>
  )
}
