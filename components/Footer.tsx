
import Container from './Container';
import Link from 'next/link';


 const Footer = () => {
    return (
        <footer className='mt-6 mb-8'>
            <Container className='flex justify-between'>
               <p className='text-sm'>Invoicipedia &copy; {new Date().getFullYear()}</p>
               <p className='text-sm'>
                Created by Colby FA with next.js, xata and Clerk.

               </p>
            </Container>
        </footer>
    )
}

export default Footer;