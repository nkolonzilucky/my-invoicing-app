import { db } from "@/db";
import { Invoices} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { updateStatusAction } from "@/app/actions";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { ChevronDown } from 'lucide-react';





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
        <main className="w-full">
            <Container>

            <div className="flex items-center justify-between mb-8 gap-4">
                <div>

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
                </div>
                <p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="flex items-center gap-2" variant={"outline"}>
                                Change Status
                                <ChevronDown className="w-4 h-auto"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {AVAILABLE_STATUSES.map((status) => {
                                return (
                                    <DropdownMenuItem key={status.id}>
                                        <form action={updateStatusAction}>
                                            <input type="hidden" name="id" value={result.id} />
                                            <input type="hidden" name="status" value={status.id} />
                                            <button>
                                                {status.label}
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
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
            </Container>
        </main>
    );
}