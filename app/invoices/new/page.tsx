import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createAction } from '@/app/actions';

export default async function Dashboard() {
    // const result = await db.execute(sql`SELECT current_database()`);
    return (
        <main className="pt-18 pl-6 flex flex-col gap-6 h-screen">
            <div className="flex flex-col justify-between">
                <h1 className="text-3xl font-bold mb-4">Create a New Invoices</h1>
                {/* {JSON.stringify(result)} */}
                <form action={createAction} className="grid gap-4 max-w-sm">
                    <div>
                        <Label className="block font-semibold text-sm mb-2" htmlFor="billing_name">Billing Name
                        </Label>
                        <Input id="billing_name" type="text" name="billing_name" />
                    </div>
                    <div>

                        <Label className="block font-semibold text-sm mb-2" htmlFor="billing_email">Billing Email</Label>
                        <Input id="billing_email" type="text" name="billing_email" />
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
                        <Button className="w-full font-semibold">Submit</Button>
                    </div>
                </form>
            </div>
        </main>
    );
}