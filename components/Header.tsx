import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import Container from './Container';

 const Header = () => {
    return (
        <header>
            <Container>
                <div className='flex justify-between items-center gap-4'>
                    <p>Invoicepedia</p>
                    <div>
                        <SignedOut>
                            <SignInButton />
                        <SignUpButton />
                            </SignedOut>
                            <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Header;