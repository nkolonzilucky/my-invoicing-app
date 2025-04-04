import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

 const Header = () => {
    return (
        <header>
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
        </header>
    )
}

export default Header;