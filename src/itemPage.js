import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
    nftaddress, nftmarketaddress
  } from './config'
  import './items.css'
  
  import NFT from './artifacts/contracts/NFT.sol/NFT.json'
  import Market from './artifacts/contracts/Market.sol/NFTMarket.json'

  export default function ItemPage() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    await window.ethereum.request({ method: "eth_requestAccounts" })

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

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }

  return (
    <div className="flex justify-center">
    <div className="px-4" style={{ maxWidth: '1600px' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <center>
        {
          nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} style={{ float: 'left', width: '350px', height: 'auto' }} />
              <div className="nftContainer">
                <h1>Nombre :</h1><p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                <p className="text-2xl mb-4 font-bold text-white">{nft.price} ETH</p>
                <p>Owner: {nft.seller}</p>
                <p>TokenId: {nft.itemId}</p>
                <button className="buyButtom" onClick={() => buyNft(nft)}>Buy</button>
              </div>
              <div className='descriptionContainer' style={{ width: "356px" }}>
              <h1>Description:</h1>
                <b>
                  <p className="text-gray-400">{nft.description}</p>
                  </b>
                  </div>
            </div>
))
        }
        </center>
      </div>
    </div>
  </div>
  )
}
