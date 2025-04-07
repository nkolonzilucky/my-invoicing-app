import { db } from "@/db";
import { Customers, Invoices} from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth} from "@clerk/nextjs/server";
import Invoice from "./Invoices";
import { updateStatusAction } from "@/app/actions";



interface InvoicePageProps {
    params: { invoiceId: string; }
    searchParams: { status: string; }
}


export default async function InvoicePage({ params, searchParams }: InvoicePageProps) {
    const {userId, orgId} = await auth();
    if(!userId) throw new Error("No userId")
    const invoiceId   = params.invoiceId;
    if(isNaN(parseInt(invoiceId))) {
        throw new Error('Invalid Invoice Id')
    }

    const isSuccess = searchParams.status === 'success';
    const isCanceled = searchParams.status === 'canceled';

    if(isSuccess) {
        const formData = new FormData();
        formData.append('id', invoiceId);
        formData.append('status', 'paid');
        await updateStatusAction(formData);
    }

    let result;
    if(orgId){
     [result] = await db.select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(
        and(
            eq(Invoices.id, parseInt(id)), 
            eq(Invoices.organizationId, orgId)
        )
    )
    .limit(1);
    } else {
    [result] = await db.select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(
        and(
            eq(Invoices.id, parseInt(invoiceId)), 
            eq(Invoices.userId, userId),
            isNull(Invoices.organizationId)
        )
    )
    .limit(1);

    }
    

    if(!result) notFound();

    const invoice = {
        ...result.invoices,
        customer: result.customers
    }

   return <Invoice invoice={invoice} />
}