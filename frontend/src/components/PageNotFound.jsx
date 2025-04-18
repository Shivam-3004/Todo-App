import React from 'react';

function PageNotFound() { // Page Not Found component
    return (
      <>
        <div className='flex h-screen items-center justify-center flex-col'>
            <span className='text-2xl'>404</span>
            <div className='text-xl font-semibold text-green-900'>Page Not Found</div>
        </div>
    </>
    );
}  

export default PageNotFound;