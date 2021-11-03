import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import { useContext, useState } from "react"
import { globalContext } from '../store'
import { AbiItem } from 'web3-utils'
import PhysicalAssetTokenContract from '../contracts/PhysicalAssetToken.json'
import PhysicalAssetTokenCreate from './PhysicalAssetTokenCreate'
import PhysicalAssetTokenListItem from './PhysicalAssetTokenListItem'
import _ from 'lodash'

export default function PhysicalAssetToken() {
  const { globalState, dispatch } = useContext(globalContext)
  const { account, web3, metadata } = globalState
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  const abiItems: AbiItem[] = web3 && PhysicalAssetTokenContract.abi as AbiItem[]
  const contract = web3 && contractAddress && new web3.eth.Contract(abiItems, contractAddress)
  const [items, setItems] = useState(null)

  async function handleTabChange(index: number) {
    console.log('index', index)
    if (index === 1) {
      const tokenIds = await contract.methods.tokenIds().call()
      console.log('tokenIds', tokenIds)
      setItems(_.range(tokenIds))
    }
  }

  return (
    <div>
      {
        account && (
        <div>  
          <Text fontWeight="bold" textAlign="center">Contract Address:</Text>
          <Tabs isFitted variant="enclosed" onChange={ handleTabChange }>
            <TabList>
              <Tab>Create</Tab>
              <Tab>List</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <PhysicalAssetTokenCreate contract={contract} web3={web3}
                  metadata={metadata} account={account} />
              </TabPanel>
              <TabPanel>
              { items && items.map( item => (
                  <PhysicalAssetTokenListItem contract={contract} web3={web3}
                  account={account} index={item} />
              ))}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
        )
      }
    </div>
  )
}