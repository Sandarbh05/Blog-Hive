import React from 'react'

function Logo({width = "120px", className = "" }) {
  return (
    <div>
      <img
      src="/BlogHiveLogo.png"
      alt="BlogHive Logo"
      style={{ width }}
      className={`rounded-3xl border-2 border-amber-400 ${className}`}
      />
    </div>
  )
}

export default Logo