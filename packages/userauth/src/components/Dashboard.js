import React, { useState } from "react"
import {  Button } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import Chats from './Chats/Chats';




export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <>
    
      <Button onClick={handleLogout} style={{
        'position':'absolute',
        'margin-top':'300px',
        'margin-left':'-200px' 
         }}>
          Log Out
        </Button>
        <Chats />

    </>
  )
}
