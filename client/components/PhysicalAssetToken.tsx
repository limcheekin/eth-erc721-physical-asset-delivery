import { Tabs, TabList, TabPanels, Tab, TabPanel, Text } from '@chakra-ui/react'
import { useContext } from "react"
import { globalContext } from '../store'
import { AbiItem } from 'web3-utils'
import PhysicalAssetTokenContract from '../contracts/PhysicalAssetToken.json'
import PhysicalAssetTokenCreate from './PhysicalAssetTokenCreate'

export default function PhysicalAssetToken() {
  const { globalState, dispatch } = useContext(globalContext)
  const { account, web3, metadata } = globalState
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  const abiItems: AbiItem[] = web3 && PhysicalAssetTokenContract.abi as AbiItem[]
  const contract = web3 && contractAddress && new web3.eth.Contract(abiItems, contractAddress)


  return (
    <div>
      <Text fontWeight="bold" textAlign="center">Contract Address:</Text>
      {
        account && (
          <Tabs isFitted variant="enclosed">
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
                <p>Listing</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )
      }
    </div>
  )
}