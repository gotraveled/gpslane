import React from 'react'
import './styles.css'

export const metadata = {
  description: 'GPS navigation devices and map-update services for the USA and Canada.',
  title: 'GPSLane — Stay on the Right Lane',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
