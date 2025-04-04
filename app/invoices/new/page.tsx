"use client"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from "@/components/SubmitButton";
import  Form  from 'next/form';
import { createAction } from '@/app/actions';
import { SyntheticEvent, useState } from "react";
import Container from "@/components/Container";
import { useUser } from "@clerk/nextjs";

export default function NewInvoice() {
    const {user} = useUser();
    // const result = await db.execute(sql`SELECT current_database()`);

    const [state, setState] = useState('ready')
    async function handleOnSubmit(event: SyntheticEvent) {
        if (state === 'pending') {
            console.log("State is pending")            
            event.preventDefault()
            return;
        }
        setState('pending');


        // const target = event.target as HTMLFormElement;
        // startTransition(async () => {
        //     const formData = new FormData(target);
        //     await createAction(formData)
        //     console.log("hey")
        // })

    }

    return (
        <main className="h-screen">
            <Container>
                <div className="flex flex-col justify-between">
                    <h1 className="text-3xl font-bold mb-6">Create a New Invoices</h1>
                    {/* {JSON.stringify(result)} */}
                    <Form action={createAction} 
                    onSubmit={handleOnSubmit} className="grid gap-4 max-w-sm">
                        <div>
                            <Label className="block font-semibold text-sm mb-2" htmlFor="billing_name">Billing Name
                            </Label>
                            <Input id="billing_name" type="text" name="billing_name" />
                        </div>
                        <div>

                            <Label className="block font-semibold text-sm mb-2" htmlFor="billing_email">Billing Email</Label>
                            <Input id="billing_email" type="text" name="billing_email" 
                            value={user?.emailAddresses[0].emailAddress}
                            />
                        </div>
                        <div>
                            <Label className="block font-semibold text-sm mb-2" htmlFor="value">Value</Label>
                            <Input id="value" type="text" name="value" />
                        </div>
                        <div>
                            <Label className="block font-semibold text-sm mb-2" htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" />
                        </div>
                        <div>
                            <SubmitButton />
                        </div>
                    </Form>
                </div>
            </Container>
        </main>
    );
}