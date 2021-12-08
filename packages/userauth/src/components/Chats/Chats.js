import React, {useState} from 'react';
import MessageInput from './MessageInput'
import { Card, Modal, Button } from "react-bootstrap"
import './style.css';
export default function Chats() {

  const [show, setShow] = useState(false);
  
 

  return (
    <>
    <Button variant="primary" onClick={() => setShow(true)} style={{
     'position':'absolute',
     'margin-top':'300px',
     'margin-left':'1000px' }}>
        Message
      </Button>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Thread
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}} >
    <Card>
      <Card.Body>
      <MessageInput />
      </Card.Body>
      </Card>
      </Modal.Body>
      </Modal>
    </>
  )
}
