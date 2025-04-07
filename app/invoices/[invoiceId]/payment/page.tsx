import { Customers, Invoices} from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import Container from "@/components/Container";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { Check } from 'lucide-react';
import { createPayment, updateStatusAction } from "@/app/actions";
import Stripe from "stripe";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET))

interface InvoicePageProps {
    params: { invoiceId: string; }
    searchParams: { 
        status: string;
        session_id:string; 
    }
}

export default async function Invoice({ params, searchParams }: InvoicePageProps) { 
    const invoiceId  =  parseInt(params.invoiceId);

    const session_id = searchParams.session_id;
    const isSuccess = session_id && searchParams.status === 'success';
    const isCanceled = searchParams.status === 'canceled';
    let isError = isSuccess && !session_id;

    if(isNaN(invoiceId)) {
        throw new Error('Invalid Invoice Id')
    }

       
    if(isSuccess ) {
        const {payment_status} = await stripe.checkout.sessions.retrieve(session_id)

        if(payment_status !== 'paid'){
            isError = true
        } else{
            const formData = new FormData();
            formData.append('id', String(invoiceId));
            formData.append('status', 'paid');
            await updateStatusAction(formData);
        }
    }

    const [result] = await db.select({
        id : Invoices.id,
        status : Invoices.status,
        createTs  : Invoices.createTs,
        description : Invoices.description,
        value : Invoices.value,
        name : Customers.name
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

    if(!result) notFound();
    const invoice = {
        ...result,
        customer: {
            name: result.name
        } 
    }

    return (
        <main className="w-full">
            <Container>
            {isError && 
                <p className="bg-red-100 text-red-800 text-center px-3 py-2 rounded-lg mb-6 text-sm">
                    Something went wrong, please try again.
                </p>}
            {isCanceled && 
                <p className="bg-yellow-100 text-yellow-800 text-center px-3 py-2 rounded-lg mb-6 text-sm">
                    Payment was canceled, please try again.
                </p>}
            <div className="grid grid-cols-2">
            <div>
            <div className="flex items-center justify-between mb-8 gap-4">
                <div className="flex gap-2 items-center">

                <h1 className="text-3xl font-semibold" >Invoice #{invoice.id}</h1>
                <Badge className={cn(
                    "rounded-full capitalize",
                    invoice.status === 'open' && 'bg-blue-500',
                    invoice.status === 'paid' && 'bg-green-600',
                    invoice.status === 'void' && 'bg-zinc-700',
                    invoice.status === 'uncollectible' && 'bg-red-600',
                )}>
                    {invoice.status}
                </Badge>
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
                    <span>{invoice.customer.name}</span>
                </li>
            </ul>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Manage Invoice</h2>
                {invoice.status === 'open' && (

                    <form action={createPayment}>
                    <input type="hidden" name="id" value={invoice.id}  />
                    <Button className="flex gap-2 bg-green-700 font-bold">
                        <CreditCard className="w-5 h-auto" />
                        Pay Invoice
                    </Button>
                </form>
                )}
                {invoice.status === 'paid' && (
                    <p className="flex gap-2 items-center text-xl font-bold">
                        <Check className="w-8 h-auto bg-green-500 rounded-full text-white p-1" />
                        Invoice Paid
                    </p>
                )}
            </div>
            </div>
            </Container>
        </main>
    );
}