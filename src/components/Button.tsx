import { LoaderCircleIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Button as DefaultButton } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof DefaultButton> & {
    isLoading?: boolean
}

export default function Button({ isLoading, ...props }: ButtonProps) {
    return (
        <DefaultButton disabled={isLoading || props.disabled} {...props} className='cursor-pointer'>
            {isLoading && <LoaderCircleIcon className="size-4 animate-spin" />}
            {props.children}
        </DefaultButton>
    )
}

