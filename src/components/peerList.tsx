import React from 'react';
import { IonList, IonItem, IonLabel, IonHeader, IonContent, IonTitle, IonToolbar } from '@ionic/react';
import { GlobalContext } from '../App'

const PeerList = () => {
    const state = React.useContext(GlobalContext)
    return (
        <IonContent>
            <IonToolbar>
                <IonTitle>Peers</IonTitle>
            </IonToolbar>
            <IonList>
                {state.state.peers.map((peer: string) => {
                    return <IonItem key={peer}><IonLabel key={peer + '1'}>Peer ID: {peer}</IonLabel></IonItem>
                })}
            </IonList>
        </IonContent>
    )
}

export default PeerList