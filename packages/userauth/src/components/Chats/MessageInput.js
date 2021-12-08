import React, { useRef, useState } from 'react';

import firebase from 'firebase/app';
import { firestore } from '../../firebase';
import { auth } from '../../firebase';
import 'firebase/analytics';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import ChatMessage from './Message';
import { Form, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
// import './style.css';


export default function Chats() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>

        <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
        </main>
      <h2 className="text-center mb-4" class="text-info">Message</h2>
      <Form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

        <Button type="submit" disabled={!formValue} className="w-100" >Send
        </Button>
      </Form>
    </>
  )
}
