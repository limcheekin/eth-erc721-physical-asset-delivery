import { Button, Input, InputGroup, InputRightElement, Box } from '@chakra-ui/react'
import { useRef, useState, useEffect } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { ViewIcon, ViewOffIcon, ArrowUpIcon } from '@chakra-ui/icons'
import styles from '../styles/ui.module.css'
import { isNull } from 'lodash'

// REF: https://stackoverflow.com/questions/55757761/handle-an-input-with-react-hooks
export function useInput(isReadOnly: boolean, placeholder: string = '') {
    const [value, setValue] = useState('')
    const input = <Input value={value} isReadOnly={isReadOnly} placeholder={placeholder} 
                    onChange={e => setValue(e.target.value)} />
    return [value, input]
}

export function usePasswordInput(isReadOnly: boolean, placeholder: string = 'Enter password') {
    const [show, setShow] = useState(false)
    const [value, setValue] = useState('')
    const handleClick = () => setShow(!show)
    const input = (
        <InputGroup size="md">
            <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                isReadOnly={isReadOnly}
                onChange={e => setValue(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? <ViewOffIcon /> : <ViewIcon />}
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

// REF: https://www.youtube.com/watch?v=BPUgM1Ig4Po
export function useImagePreview(handleSubmit) {
    const [image, setImage] = useState<File>();
    const [preview, setPreview] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(image);
        }
    }, [image]);

    const imagePreview = (
        <form className={styles.imagePreviewForm}>
            {preview ? (
                <img
                    src={preview}
                    style={{ objectFit: "cover" }}
                    onClick={(event) => {
                        event.preventDefault();
                        fileInputRef.current.click();
                    }}
                />
            ) : (
                <button className={styles.addImageButton}
                    onClick={(event) => {
                        event.preventDefault();
                        fileInputRef.current.click();
                    }}
                >
                    Click to Add Image
                </button>
            )}
            <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                accept="image/*"
                onChange={(event) => {
                    const file = event.target.files[0];
                    if (file && file.type.substr(0, 5) === "image") {
                        setImage(file);
                    } else {
                        setImage(null);
                    }
                }}
            />
            <Box p="1" />
            <Button type="submit" leftIcon={<ArrowUpIcon  />}
                disabled={image === undefined}
                onClick={(e) => handleSubmit(e)}>
                Upload Image
            </Button>
        </form>
    );

    return [image, imagePreview]
}
