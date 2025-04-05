"use server"

import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function createAction(formData: FormData) {
    const {userId} = await auth()
    console.log("the userId is: ", userId)
    const value = Math.floor(parseFloat(String(formData.get('value')))) * 100; //storing as int
    const description = formData.get('description') as string;

    if(!userId) return

    const results = await db.insert(Invoices).values({
        value,
        description,
        userId,
        status: 'open'
    }).returning({
        id: Invoices.id
    })

    
    redirect(`/invoices/${results[0].id}`)

}