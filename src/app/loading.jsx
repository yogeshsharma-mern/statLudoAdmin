
import React from 'react'

export default function Loading() {
  return (
    <div>
        <div className="flex inset-0 flex items-center justify-center bg-white z-50">
                  <div className="flex w-full justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
    </div>
  )
}
