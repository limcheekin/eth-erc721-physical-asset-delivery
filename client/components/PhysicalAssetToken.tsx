import { Text, Grid, GridItem, extendTheme } from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { globalContext } from '../store'
import { AbiItem } from 'web3-utils'
import { useButton, useInput, usePasswordInput } from '../hooks/ui'
import { useSingleSelect } from '../hooks/datepicker'
import PhysicalAssetTokenContract from '../contracts/PhysicalAssetToken.json'
import ImageUpload from './ImageUpload'

// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function PhysicalAssetToken() {
  const { globalState, dispatch } = useContext(globalContext)
  const { account, web3 } = globalState
  const [createOutput, setCreateOutput] = useState("")
  const [unlockOutput, setUnlockOutput] = useState("")
  const [createButtonLoading, createButton] = useButton(createToken, 'Create')
  const [tokenUrl, tokenUrlInput] = useInput(createButtonLoading as boolean, 'Token URL')
  const [address, addressInput] = useInput(createButtonLoading as boolean, 'NFT Holder Address')
  const [lockFromDate, lockFromDateInput] = useSingleSelect(createButtonLoading as boolean, 'Lock From Date')
  const [unlockPassword, unlockPasswordInput] = usePasswordInput(createButtonLoading as boolean, 'Unlock Password')
  const [unlockButtonLoading, unlockButton] = useButton(unlockToken, 'Unlock')
  const [unlock, unlockInput] = usePasswordInput(unlockButtonLoading as boolean)
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  const abiItems: AbiItem[] = web3 && JSON.parse(JSON.stringify(PhysicalAssetTokenContract.abi))
  const contract = web3 && contractAddress && new web3.eth.Contract(abiItems, contractAddress)

  async function createToken() {
    console.log('createToken')
    try {
      //await contract.methods.setGreeting(greeting).send({ from: account })
    } catch (error) {
      console.error('error in try...catch', error)
    } 
  }

  async function unlockToken() {
    console.log('unlockToken')
    try {
      //await contract.methods.setGreeting(greeting).send({ from: account })
    } catch (error) {
      console.error('error in try...catch', error)
    } 
  }

  return (
    <div>
      { 
        account && (
        <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(3, 1fr)" gap={3}>
          <GridItem align="center" rowSpan={4}>
            <ImageUpload />
          </GridItem>
          <GridItem>{tokenUrlInput}</GridItem>
          <GridItem>{addressInput}</GridItem>
          <GridItem>{lockFromDateInput}</GridItem>
          <GridItem>{unlockPasswordInput}</GridItem>
          <GridItem colSpan={2}>{createButton}</GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight="bold" textAlign="center">{createOutput}</Text>
          </GridItem>

          <GridItem align="end">{unlockButton}</GridItem>
          <GridItem>{unlockInput}</GridItem>
          <GridItem colSpan={2}>
            <Text fontWeight="bold" textAlign="center">{unlockOutput}</Text>
          </GridItem>
        </Grid>
        ) 
      }
    </div>
  )
}