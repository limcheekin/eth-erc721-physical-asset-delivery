import '../styles/globals.css'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { GlobalStore } from '../store'
import { theme } from '../styles/theme'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <GlobalStore>
            <ChakraProvider theme={theme}>
                <Component {...pageProps} />
            </ChakraProvider>
        </GlobalStore>
    )
}
