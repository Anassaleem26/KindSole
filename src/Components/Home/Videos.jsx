import React from 'react'
import AutoScroll from './AutoScroll'

function Videos() {
    return (
        <div>

            <div className='pb-11'>
                <AutoScroll/>
            </div>

            <div className=' w-auto flex gap-4 object-cover px-11 pb-9'>
                <video
                    src="/src/assets/videos/1.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className='w-full h-110 object-cover rounded-md'
                />
                <video
                    src="/src/assets/videos/2.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className='w-full h-110 object-cover rounded-md'
                />
                <video
                    src="/src/assets/videos/3.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className='w-full h-110 object-cover rounded-md'
                />
                <video
                    src="/src/assets/videos/7.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className='w-full h-110 object-cover rounded-md'
                />
                <video
                    src="/src/assets/videos/5.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className='w-full h-110 object-cover rounded-md'
                />
            </div>
        </div>
    )
}

export default Videos