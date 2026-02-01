import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <div className='flex items-center justify-center gap-6 h-10'>
            <h1 className=''>Made with ❤️ by Utkarsh Sarkari</h1>
            <Link href="https://www.linkedin.com/in/utkarshsarkari/" className='text-blue-500 underline'>LinkedIn</Link>
            <Link href="https://github.com/UtkarshSarkari" className='text-blue-500 underline'>GitHub</Link>
        </div>
    )
}

export default Footer
