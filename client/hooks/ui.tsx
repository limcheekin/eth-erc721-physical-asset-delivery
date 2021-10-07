import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

// REF: https://stackoverflow.com/questions/55757761/handle-an-input-with-react-hooks
export function useInput(isReadOnly: boolean) {
    const [value, setValue] = useState('')
    const input = <Input value={value} isReadOnly={isReadOnly} onChange={e => setValue(e.target.value)} />
    return [value, input]
}

export function usePasswordInput(isReadOnly: boolean) {
    const [show, setShow] = useState(false)
    const [value, setValue] = useState('')
    const handleClick = () => setShow(!show)
    const input = (
        <InputGroup size="md">
            <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                value={value} 
                isReadOnly={isReadOnly} 
                onChange={e => setValue(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? <ViewOffIcon /> : <ViewIcon /> }
                </Button>
            </InputRightElement>
        </InputGroup>
    )

    return [value, input]
}

export function useButton(onClickHandler, label: string) {
    const [loading, setLoading] = useState(false)
    const button = <Button isFullWidth isLoading={loading}
        spinner={<BeatLoader size={8} color="grey" />}
        onClick={async () => { setLoading(true); await onClickHandler(); setLoading(false) }}>{label}</Button>
    return [loading, button]
}