import { auth } from '../../firebase';
import 'firebase/analytics';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Message(props) {
    const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


    return (
        <>
            <div className={`message ${messageClass}`}>
                <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt={'avatar'}/>
                <p>{text}</p>
            </div>

        </>
    )
}
