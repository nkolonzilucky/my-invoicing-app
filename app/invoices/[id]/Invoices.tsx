"use client"
import { Invoices} from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { updateStatusAction, deleteInvoiceAction } from "@/app/actions";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { ChevronDown } from 'lucide-react';
import { useOptimistic } from "react";
import { Ellipsis } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  

interface InvoiceProps {
    invoice: typeof Invoices.$inferSelect
}




export default function Invoice({ invoice }: InvoiceProps) {
    const [currentStatus, setCurrentStatus] = useOptimistic(invoice.status, (status, newStatus) => {
        return String(newStatus)

    })

    async function handleOnUpdateStatus(formData:  FormData){
        console.log("Entered the guy")
        const originalStatus = currentStatus;
        setCurrentStatus(formData.get('status'))
        try{       
            throw new Error("Am making this fail")
            await updateStatusAction(formData)
        } catch(e) {
            console.log(e)
            setCurrentStatus(originalStatus)

        }
    }

    return (
        <main className="w-full">
            <Container>

            <div className="flex items-center justify-between mb-8 gap-4">
                <div>

                <h1 className="text-3xl font-semibold" >Invoice #{invoice.id}</h1>
                <Badge className={cn(
                    "rounded-full capitalize",
                    currentStatus === 'open' && 'bg-blue-500',
                    currentStatus === 'paid' && 'bg-green-600',
                    currentStatus === 'void' && 'bg-zinc-700',
                    currentStatus === 'uncollectible' && 'bg-red-600',
                )}>
                    {currentStatus}
                </Badge>
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center gap-2" variant={"outline"}>
                                Change Status
                                <ChevronDown className="w-4 h-auto"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {AVAILABLE_STATUSES.map((status) => {
                                return (
                                    <DropdownMenuItem key={status.id}>
                                        <form action={updateStatusAction}>
                                            <input type="hidden" name="id" value={invoice.id} />
                                            <input type="hidden" name="status" value={status.id} />
                                            <button type="submit">
                                                {status.label}
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>


                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="flex items-center gap-2" variant={"outline"}>
                                    <span className="sr-only">More Options</span>
                                    <Ellipsis className="w-4 h-auto"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                        <DropdownMenuItem>
                                        <DialogTrigger asChild>
                                            <button className="flex items-center gap-1">
                                                        <Trash2 className="w-4 h-auto" />
                                                Delete Invoice
                                            </button>    
                                        </DialogTrigger>
                                        </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                            <DialogHeader className="gap-4">
                                <DialogTitle className="text-2xl text-center">Delete Invoice?</DialogTitle>
                            <DialogDescription className="text-center">
                                This action cannot be undone. This will permanently remove your invoice from our servers.
                            </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex justify-center">
                                <form action={deleteInvoiceAction}>
                                    <input type="hidden" name="id" value={invoice.id} />
                                    <Button variant={"destructive"} className="flex items-center gap-1">
                                        <Trash2 className="w-4 h-auto" />
                                        Yes I am sure
                                    </Button>
                                        
                                </form>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <p className="text-3xl mb-3">
                {(invoice.value/100).toFixed(2)}
            </p>
            <p className="text-lg mb-8">
                {invoice.description}
            </p>
            <h2 className="font-bold text-lg mb-4">
                Billing Details
            </h2>
            <ul className="grid gap-2">
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice ID</strong>
                    <span>{invoice.id}</span>
                </li>
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Date</strong>
                    <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
                </li>
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name</strong>
                    <span>Name</span>
                </li>
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Email</strong>
                    <span>Email</span>
                </li>
            </ul>
            </Container>
        </main>
    );
}