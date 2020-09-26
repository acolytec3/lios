import React from 'react';
import { IonList, IonItem, IonLabel, IonContent, IonTitle, IonToolbar } from '@ionic/react';
import { GlobalContext } from '../App'

const Messages = () => {
    const state = React.useContext(GlobalContext)
    return (
    <IonContent>
        <IonToolbar>
            <IonTitle>Messages</IonTitle>
        </IonToolbar>
        <IonList>
            {state.state.messages.map((message: string) => {
                return <IonItem key={message+Date.now()}><IonLabel key={message+Date.now()+'1'}>Message: {message}</IonLabel></IonItem>
            })}
        </IonList>
    </IonContent>
    )
}

export default Messages