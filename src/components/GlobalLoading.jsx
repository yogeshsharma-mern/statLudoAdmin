import React from 'react'

export default function GlobalLoading() {
  return (
    <div>
        <div className="flex items-center justify-center w-[70vw] h-[30vh]">
                  <div className="flex w-full justify-center items-center">
        <div className="animate-spin  rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
    </div>
  )
}
