import { db } from "@/db";
import { Customers, Invoices} from "@/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth} from "@clerk/nextjs/server";
import Invoice from "./Invoices";



interface InvoicePageProps {
    params: { invoiceId: string; }
}


export default async function InvoicePage({ params}: InvoicePageProps) {
    const {userId, orgId} = await auth();
    if(!userId) throw new Error("No userId")
    const invoiceId   = params.invoiceId;
    if(isNaN(parseInt(invoiceId))) {
        throw new Error('Invalid Invoice Id')
    }
   

    let result;
    if(orgId){
     [result] = await db.select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(
        and(
            eq(Invoices.id, parseInt(invoiceId)), 
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