import { CirclePlus } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { db } from '@/db';
import { Customers, Invoices } from '@/db/schema';
import { cn } from '@/lib/utils';
import Container from '@/components/Container';
import { auth } from '@clerk/nextjs/server';
import { and, eq, isNull } from 'drizzle-orm';


export default async function Dashboard() {
    const {userId, orgId} = await auth();
    if(!userId) {
        throw new Error("UserId does not exist")
    }
    let result;
    if(orgId){

        result = await db.select()
        .from(Invoices).innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(eq(Invoices.organizationId, orgId))
    } else {
        result = await db.select()
        .from(Invoices).innerJoin(Customers, eq(Invoices.customerId, Customers.id))
        .where(
            and(
                eq(Invoices.userId, userId),
                isNull(Invoices.organizationId)
        ))

    }

    const invoices = result?.map(({ invoices, customers }) => {
        return {
            ...invoices,
            customer: customers
        }
    })

    return (
        <main className="h-screen">
            <Container>
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold mb-6">Invoices</h1>
                    <p>
                        <Link href={"/invoices/new"}>
                            <Button className='inline-flex gap-2' variant={"ghost"}>
                                <CirclePlus className='h-4 w-4' />
                                Create Invoice
                            </Button>
                        </Link>
                    </p>
                </div>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] p-4">Date</TableHead>
                        <TableHead className="p-4">Customer</TableHead>
                        <TableHead className="p-4">Email</TableHead>
                        <TableHead className="text-center p-4">Status</TableHead>
                        <TableHead className="text-right p-4">Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map(result => {
                        return (
                            <TableRow key={result.id}>
                            <TableCell className="font-medium text-left">
                                <Link href={`/invoices/${result.id}`} className="block font-semibold px-4">
                                    {new Date(result.createTs).toLocaleDateString()}
                                </Link>
                            </TableCell>
                            <TableCell className="text-left">
                                <Link href={`/invoices/${result.id}`} className="block font-semibold px-4">
                                    {result.customer.name}
                                </Link>
                            </TableCell>
                            <TableCell className="text-left">
                                <Link href={`/invoices/${result.id}`} className="block font-semibold px-4">
                                    {result.customer.email}
                                </Link>
                            </TableCell>
                            <TableCell className="text-center">
                                <Link href={`/invoices/${result.id}`} className='block px-4'>
                                <Badge variant={'outline'} className={cn(
                                    "rounded-full text-white capitalize",
                                    result.status === 'open' && 'bg-blue-500',
                                    result.status === 'paid' && 'bg-green-600',
                                    result.status === 'void' && 'bg-zinc-700',
                                    result.status === 'uncollectible' && 'bg-red-600'
                                    
                                )}>
                                    {result.status}
                                </Badge>
                                </Link>
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/invoices/${result.id}`} className='block px-4'>
                                    ${(result.value / 100).toFixed(2)}
                                </Link>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                    
                </TableBody>
            </Table>
        </Container>
    </main>
    );
}