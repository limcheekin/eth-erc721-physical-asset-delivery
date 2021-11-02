import { useContext } from 'react'
import { globalContext } from '../store'
import { useImagePreview } from '../hooks/ui'
import { NFTStorage, File } from 'nft.storage'
import mime from 'mime-types'
import { Text } from '@chakra-ui/react'

export default function ImageUpload() {
    const [file, imageUpload] = useImagePreview(handleImageUpload)
    const { globalState, dispatch } = useContext(globalContext)

    async function handleImageUpload(e) {
        e.preventDefault();
        const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY })
        const uploadFile = file as File
        const fileName = uploadFile.name
        const type = mime.lookup(fileName)
        const metadata =
            await client.store({
                name: fileName,
                description: 'File uploaded on ' + new Date(),
                image: new File(
                    [ uploadFile ],
                    fileName,
                    { type }
                ),
            })

        console.log('metadata', metadata)
        dispatch({ type: 'SET_METADATA', payload: metadata })
    }

    return (
        <div>
            {
                imageUpload
            }
            {
                globalState.metadata &&
                <Text>Image uploaded successfully.</Text>
            }
        </div>
    )
}