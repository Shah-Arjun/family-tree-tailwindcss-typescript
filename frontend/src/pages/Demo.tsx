import { Trees } from 'lucide-react'

export default function Demo() {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-background text-foreground gap-5 animate-pulse '>
            <Trees className='w-20 h-20 text-foreground' />
            <h1 className='text-5xl'>Comming Soon...</h1>
        </div>
    )
}