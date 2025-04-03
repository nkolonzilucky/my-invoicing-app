"use server"

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createAction(formData: FormData) {
    const value = Math.floor(parseFloat(String(formData.get('value')))) * 100; //storing as int
    const description = formData.get('description') as string;
    const name = formData.get('billing_name');
    const email = formData.get('billing_email');

    const results = await db.insert(Invoices).values({
        value,
        name,
        email,
        description,
        status: 'open'
    }).returning({
        id: Invoices.id
    })

    
    redirect(`/invoices/${results[0].id}`)

}