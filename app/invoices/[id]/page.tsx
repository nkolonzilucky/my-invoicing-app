import { db } from "@/db";
import { Invoices } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Invoice({ params }: { params: { id: string } }) {
    const user = await currentUser();
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
    return (
        <main className="max-w-5xl mx-auto my-12">
            <div className="flex items-center mb-8 gap-4">
                <h1 className="text-3xl font-semibold" >Invoice #{id}</h1>
                <Badge className={cn(
                    "rounded-full capitalize",
                    result.status === 'open' && 'bg-blue-500',
                    result.status === 'paid' && 'bg-green-600',
                    result.status === 'void' && 'bg-zinc-700',
                    result.status === 'uncollectible' && 'bg-red-600',
                )}>
                    {result.status}
                </Badge>
                <p>

                </p>
            </div>
            <p className="text-3xl mb-3">
                {(result.value/100).toFixed(2)}
            </p>
            <p className="text-lg mb-8">
                {result.description}
            </p>
            <h2 className="font-bold text-lg mb-4">
                Billing Details
            </h2>
            <ul className="grid gap-2">
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice ID</strong>
                    <span>{result.id}</span>
                </li>
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Date</strong>
                    <span>{new Date(result.createTs).toLocaleDateString()}</span>
                </li>
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name</strong>
                    <span>{user?.firstName} {user?.lastName}</span>
                </li>
                <li className="flex gap-4">
                    <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Email</strong>
                    <span>{user?.emailAddresses[0].emailAddress}</span>
                </li>
            </ul>
        </main>
    );
}