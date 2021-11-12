import { Text, Grid, GridItem, Input } from "@chakra-ui/react"
import { useState, useContext, useEffect } from "react"
import { Contract } from 'web3-eth-contract'
import { useButton, useInput, usePasswordInput } from '../hooks/ui'
import { useSingleSelect } from '../hooks/datepicker'
import ImageUpload from './ImageUpload'

type Props = {
  contract: Contract
  web3: any
  metadata: any
  account: string
}

// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function PhysicalAssetTokenCreate({
  contract,
  web3,
  metadata,
  account
}: Props) {
  const [createOutput, setCreateOutput] = useState("")
  const [createButtonLoading, createButton] = useButton(createToken, 'Create')
  const [tokenUri, tokenUriInput] = useInput(createButtonLoading as boolean, 'Token URI')
  const [address, addressInput] = useInput(createButtonLoading as boolean, 'NFT Holder Address')
  const [lockFromDate, lockFromDateInput] = useSingleSelect(createButtonLoading as boolean, 'Lock From Date')
  const [unlockPassword, unlockPasswordInput] = usePasswordInput(createButtonLoading as boolean, 'Unlock Password')

  async function createToken() {
    console.log('createToken')
    try {
      const metadataURI = metadata == null ? tokenUri : metadata.url
      const timestampLockedFrom = Math.round(Date.parse(lockFromDate as string) / 1000)
      const unlockPasswordHash = web3.utils.sha3(web3.utils.sha3(unlockPassword as string)) // double hash
      console.log('metadataURI', metadataURI)
      console.log('lockFromDate', lockFromDate, 'timestampLockedFrom', timestampLockedFrom)
      console.log('unlockPasswordHash', unlockPasswordHash)
      console.log('address', address)
      console.log('account', account)
      const result = await contract.methods.mint(address,
        metadataURI,
        timestampLockedFrom,
        unlockPasswordHash)
        .send({ from: account })
      console.log('result', result)
      if (result?.status) {
        setCreateOutput('PA token created successfully.')
      }
    } catch (error) {
      console.error('error in try...catch', error)
    }
  }

  return (
    <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(3, 1fr)" gap={3}>
      <GridItem align="center" rowSpan={4}>
        <ImageUpload />
      </GridItem>
      <GridItem>
        {metadata == null ? tokenUriInput :
          <Input isReadOnly={true} value={metadata.url} />}
      </GridItem>
      <GridItem>{addressInput}</GridItem>
      <GridItem>{lockFromDateInput}</GridItem>
      <GridItem>{unlockPasswordInput}</GridItem>
      <GridItem colSpan={2}>{createButton}</GridItem>
      <GridItem colSpan={2}>
        <Text fontWeight="bold" textAlign="center">{createOutput}</Text>
      </GridItem>
    </Grid>
  )
}