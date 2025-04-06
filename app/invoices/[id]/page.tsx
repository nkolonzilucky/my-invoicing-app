import { db } from "@/db";
import { Invoices} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth, currentUser} from "@clerk/nextjs/server";
import Invoice from "./Invoices";






export default async function InvoicePage({ params }: { params: { id: string } }) {
    const {userId} = await auth();
    if(!userId) throw new Error("No userId")
    const { id }  =  await params;
    if(isNaN(parseInt(id))) {
        throw new Error('Invalid Invoice Id')
    }

    const [result] = await db.select()
    .from(Invoices)
    .where(
        and(
            eq(Invoices.id, parseInt(id)), 
            eq(Invoices.userId, userId)
        )
    )
    .limit(1);

    if(!result) notFound();
   return <Invoice invoice={result} />
}