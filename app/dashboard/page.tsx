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
import { Invoices } from '@/db/schema';


export default async function Dashboard() {
    const result = await db.select().from(Invoices)
    return (
        <main className="pt-6 pl-6 flex flex-col text-center gap-6 h-screen mx-auto">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Invoices</h1>
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
                {result.map(result => {
                    return (
                        <TableRow key={result.id}>
                        <TableCell className="font-medium text-left p-4">
                            <span className="font-semibold">
                                {new Date(result.createTs).toLocaleDateString()}
                            </span>
                        </TableCell>
                        <TableCell className="text-left p-4">
                            <span className="font-semibold">
                                {result.name}
                            </span>
                        </TableCell>
                        <TableCell className="text-left p-4">
                            <span className="font-semibold">
                                {result.email}
                            </span>
                        </TableCell>
                        <TableCell className="text-center p-4">
                            <Badge variant={"outline"} className="bg-black text-white rounded-full">
                                {result.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right p-4">
                            <span>
                                ${result.value / 100}
                            </span>
                        </TableCell>
                    </TableRow>
                    );
                })}
                
            </TableBody>
        </Table>
    </main>
    );
}