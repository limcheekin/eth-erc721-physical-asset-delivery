import { Text, Grid, GridItem } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { Contract } from 'web3-eth-contract'
import { useButton, usePasswordInput } from '../hooks/ui'
import styles from '../styles/listitem.module.css'

type Props = {
  contract: Contract
  web3: any
  account: string
  index: number
}

// REF: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
export default function PhysicalAssetTokenListItem({
  contract,
  web3,
  account,
  index
}: Props) {
  const [unlockOutput, setUnlockOutput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [unlockButtonLoading, unlockButton] = useButton(unlockToken, 'Unlock')
  const [unlock, unlockInput] = usePasswordInput(unlockButtonLoading as boolean, 'Enter Unlock Password')
  const IPFS_GATEWAY_URL = 'https://hash.ipfs.dweb.link/filename'

  async function unlockToken() {
    console.log('unlockToken')
    try {
      const unlockHash = web3.utils.sha3(unlock as string)
      console.log('unlockHash', unlockHash)
      const result = await contract.methods.unlockToken(unlockHash, index)
        .send({ from: account })
      console.log('result', result)
      if (result?.status) {
        setUnlockOutput('Token unlocked successfully.')
      }
    } catch (error) {
      console.error('error in try...catch', error)
    }
  }

  function getHttpUrl(url: string) {
    const startIndex = url.indexOf('/') + 2
    const endIndex = url.lastIndexOf('/')
    const hash = url.substring(startIndex, endIndex)
    const filename = url.substring(endIndex + 1)
    const httpUrl = IPFS_GATEWAY_URL.replace('hash', hash).replace('filename', filename)
    console.log('httpUrl', httpUrl)
    return httpUrl
  }

  // REF: https://jasonwatmore.com/post/2020/01/27/react-fetch-http-get-request-examples
  useEffect(() => {
    // GET request using fetch with error handling
    contract.methods.tokenURI(index).call().then((url: string) => {
      console.log('tokenURI', url)
      const httpUrl = getHttpUrl(url)
      fetch(httpUrl)
      .then(async response => {
          const data = await response.json();

          // check for error response
          if (!response.ok) {
              // get error message from body or default to response statusText
              const error = (data && data.message) || response.statusText;
              return Promise.reject(error);
          }

          setName(data.name)
          setDescription(data.description)
          setImageUrl(getHttpUrl(data.image))
      })
      .catch(error => {
          console.error('There was an error!', error);
      });
    });

  // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, []);

  return (
    <Grid mt="5" templateColumns="repeat(2, 1fr)" templateRows="repeat(2, 1fr)" gap={3}>
      <GridItem align="center" rowSpan={4}>
        <img
          className={styles.listItemImage}
          src={imageUrl}
        />
      </GridItem>
      <GridItem>
        <Text fontWeight="bold">{name}</Text>
      </GridItem>
      <GridItem><Text>{description}</Text></GridItem>
      <GridItem>{unlockInput}</GridItem>
      <GridItem>{unlockButton}</GridItem>
      <GridItem colSpan={2}>
        <Text fontWeight="bold" textAlign="center">{unlockOutput}</Text>
      </GridItem>
    </Grid>
  )
}