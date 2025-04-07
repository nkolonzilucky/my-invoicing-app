"use server"

import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from 'stripe';


const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

export async function createAction(formData: FormData) {
    const {userId, orgId} = await auth()
    
    if(!userId) return
    
    const description = formData.get('description') as string;
    const name = formData.get('billing_name') as string;
    const email = formData.get('billing_email') as string;
    const value = Math.floor(parseFloat(String(formData.get('value')))) * 100; //storing as int


    const [customer] = await db.insert(Customers).values({
        name,
        email,
        userId,
        organizationId: orgId || null
    }).returning({
        id: Customers.id
    })
    
    const results = await db.insert(Invoices).values({
        value,
        description,
        userId,
        customerId: customer.id,
        status: 'open',
        organizationId: orgId || null
    }).returning({
        id: Invoices.id
    })

    
    redirect(`/invoices/${results[0].id}`)

}

export async function updateStatusAction(formData: FormData) {
    console.log("Entered the updateStatusAction function")
    const { userId, orgId } = await auth()
    if(!userId) return;

    const id = formData.get('id') as string;
    const status = formData.get('status') as string;
    if(orgId){
        await db.update(Invoices).set({status}).where(and(eq(Invoices.id, parseInt(id)),eq(Invoices.userId, userId), eq(Invoices.organizationId, orgId)))
    } else {
        await db.update(Invoices).set({status}).where(and(eq(Invoices.id, parseInt(id)),eq(Invoices.userId, userId), isNull(Invoices.organizationId)))
    }
    


    revalidatePath(`/invoices/${id}`, 'page' )
}

export async function deleteInvoiceAction(formData: FormData){
    const { userId, orgId } = await auth()
    if(!userId) return;

    const id = formData.get('id') as string;

    if(orgId) {
        await db.delete(Invoices).where(and(eq(Invoices.id, parseInt(id)),eq(Invoices.userId, userId), eq(Invoices.organizationId, orgId)))
    } else {   
        await db.delete(Invoices).where(and(eq(Invoices.id, parseInt(id)),eq(Invoices.userId, userId), isNull(Invoices.organizationId)))
    }


    redirect("/dashboard" )

}

export async function createPayment(formData: FormData) {
    const headersList = headers();
    const origin = (await headersList).get('origin');
    const id = parseInt(formData.get('id') as string);

    const [result] = await db.select({
        status: Invoices.status,
        value: Invoices.value

        }
    ).from(Invoices).where(eq(Invoices.id, id)).limit(1)
    //The stripe part

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                //Provide the exact Price ID (for example, pr_1234) of the 
               price_data: {
                currency: 'usd',
                product: 'prod_S5KsD9rqnu2dxb',
                unit_amount: result.value
               },
               quantity: 1, 

            }
        ],
        mode: 'payment',
        success_url: `${origin}/invoices/${id}/payment/?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/invoices/${id}/payment/status=canceled&session_id={CHECKOUT_SESSION_ID}`
    });
    if(!session.url){
        throw new Error("Invalid stripe session")
    } else{
        redirect(session.url)
    }
}