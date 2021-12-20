import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import detectEthereumProvider from '@metamask/detect-provider'
import './market.css'

import {
  nftaddress, nftmarketaddress
} from './config'

import NFT from './artifacts/contracts/NFT.sol/NFT.json'
import Market from './artifacts/contracts/Market.sol/NFTMarket.json'

const Web3 = require('web3')

let rpcEndpoint = null

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
  rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}

export default function Home() {
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
  async function buyNft(nft) {

    const connection = await window.ethereum.request({ method: "eth_requestAccounts" })
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
<<<<<<< HEAD
              <div key={i} className="itemContainer">
=======
              <div key={i} className="border shadow rounded-xl overflow-hidden">
              <a href={ "/nft/tokenId/" + nft.itemId }>
              <div key={i} className="border shadow rounded-xl overflow-hidden">
>>>>>>> 1c798fb17c33a064eb8874646e22135542e0d89f
                <img src={nft.image} />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
<<<<<<< HEAD
                 <a href={ "/nft/tokenId/" + nft.itemId }>
                   <button>
                     View this item
                     </button>
                   </a>
=======
                  <p>Owner: {nft.seller}</p>
                  <p>TokenId: {nft.itemId}</p>
                  <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
>>>>>>> 1c798fb17c33a064eb8874646e22135542e0d89f
                </div>
              </div>
              </a>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
