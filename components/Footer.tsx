
import Container from './Container';


 const Footer = () => {
    return (
        <footer className='mt-12 mb-8'>
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