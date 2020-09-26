import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, IonToast } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { BiNetworkChart, BiRefresh } from 'react-icons/bi'
import { TiMessages } from 'react-icons/ti'
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/loader.css';

/* Background services */
import pipe from 'it-pipe'

/* Local imports */
import id from './assets/nodeId.json'
import PeerList from './components/peerList';
import Messages from './components/messages'

/* Legacy imports */
const PROTOCOL = '/libp2p/chat/1.0.0'
const libp2p = require('libp2p')
const WS = require('libp2p-websockets')
const wrtc = require('libp2p-webrtc-star')
const { NOISE } = require('libp2p-noise')
const PeerID = require('peer-id')
const mplex = require('libp2p-mplex')

const options: any = {
  modules: {
    transport: [WS, wrtc],
    connEncryption: [NOISE],
    streamMuxer: [mplex],
  },
  addresses: {
    listen: ['/ip4/192.168.1.194/tcp/13579/wss/p2p-webrtc-star',
    '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
    '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'],
  }
}

interface IContextProps {
  state: globalState;
  dispatch: ({ type }: { type: string }) => void;
}

type globalState = {
  peers: string[],
  messages: string[]
}

const initialState = {
  peers: [],
  messages: []
}

export const GlobalContext = React.createContext({} as IContextProps)

const reducer = (state: globalState, action: any): globalState => {
  console.log(state)
  console.log(action)
  switch (action.type) {
    case 'ADD_PEER': {
      if (state.peers.filter((peer) => peer === action.peerId).length > 0)
        return state;
      let newPeers = [...state.peers]
      newPeers.push(action.peerId)
      return { ...state, peers: newPeers }
    }
    case 'ADD_MESSAGE': {
      let newMessages = [...state.messages]
      newMessages.push(action.message)
      return { ...state, messages: newMessages }
    }
    default:
      return state;
  }
}



var node: any

const App: React.FC = () => {

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [connected, setStatus] = React.useState(false)
  const [connecting, setConnecting] = React.useState(false)
  const [showToast, setToaster] = React.useState(false)
  const [toastMessage, setMessage] = React.useState('')
  const [toastColor, setColor] = React.useState('')
  const startup = async () => {
    setConnecting(true)
    let nodeId: any = await PeerID.createFromJSON(id)
    options.peerId = nodeId
    node = await libp2p.create(options)
    node.connectionManager.on('peer:connect', (connection: any) => {
      console.log('connected to: ', connection.remotePeer.toB58String())
      dispatch({ type: 'ADD_PEER', peerId: connection.remotePeer.toB58String() })
    })

    await node.handle(PROTOCOL, async ({ stream }: any) => {
      console.log('Connected to someone!')
      receive(stream)
    })
    try {
      await node.start();
      setMessage('Node started')
      setColor('success')
      setToaster(true)
      setStatus(true)
      setConnecting(false)
    }
    catch (err) {
      console.log(err)
      setMessage('Could not start node.  Retrying')
      setColor('warning')
      setToaster(true)
    }

  }

  function receive(stream: any) {
    pipe(
      // Read from the stream (the source)
      stream.source,
      // Sink function
      async function (source) {
        // For each chunk of data
        for await (const msg of source) {
          // Output the data as a utf8 string
          dispatch({ type: 'ADD_MESSAGE', message: msg.toString('utf8').replace('\n', '') })
        }
      }
    )
  }

  React.useEffect(() => {
    startup()
  },[])

  const value = { state, dispatch }
  return (
    <GlobalContext.Provider value={value}>
      <IonApp>
      <IonReactRouter>
        <IonTabs>
            <IonRouterOutlet>
              <Route path="/peers" component={PeerList} exact={true} />
              <Route path="/messages" component={Messages} exact={true} />
              <Route exact path="/" render={() => <Redirect to="/peers" />} />
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/peers">
                <BiNetworkChart />
                <IonLabel>Peers</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/messages">
                <TiMessages />
                <IonLabel>Messages</IonLabel>
              </IonTabButton>
              <IonTabButton onClick={() => startup()}>
                <BiRefresh />
                <IonLabel>Reconnect</IonLabel>
              </IonTabButton>
            </IonTabBar>

          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setToaster(false)}
            message={toastMessage}
            color={toastColor}
            animated
            duration={3000}
            position="top"
          />
        </IonTabs>
        </IonReactRouter>
        {!connected && <div className="lds-ripple"><div></div><div></div></div>}
      </IonApp>
    </GlobalContext.Provider>
  );
}

export default App;
