import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type DropdownProps = {
    trigger: React.ReactNode;
    label?: string;
    items: { label: string; id: string; onClick: () => void }[];
}


export default function Dropdown({ trigger, label, items }: DropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent>
                {
                    label && <>
                        <DropdownMenuLabel>{label}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                    </>
                }

                {
                    items.map(({ id, label, onClick }) => (
                        <DropdownMenuItem key={id} onClick={onClick}>
                            {label}
                        </DropdownMenuItem>
                    ))
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
