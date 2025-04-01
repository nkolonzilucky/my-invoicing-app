import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Dashboard() {
    return (
        <main className="pt-6 pl-6 flex flex-col text-center gap-6 h-screen mx-auto">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Create Invoices</h1>
            </div>
        </main>
    );
}