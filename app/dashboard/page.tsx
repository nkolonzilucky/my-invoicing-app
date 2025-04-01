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


export default function Dashboard() {
    return (
        <main className="pt-6 flex flex-col text-center gap-6 h-screen">
        <h1 className="text-5xl font-bold text-white">Dashboard</h1>
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium text-left">
                        <span className="font-semibold">
                            10/31/2024
                        </span>
                    </TableCell>
                    <TableCell className="text-left">
                        <span className="font-semibold">
                            Philip J. Fry
                        </span>
                    </TableCell>
                    <TableCell className="text-left">
                        <span className="font-semibold">
                            fry@planetexpress.com
                        </span>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant={"outline"} className="bg-black text-white rounded-full">
                            Open
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <span>
                            $250.00
                        </span>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </main>
    );
}