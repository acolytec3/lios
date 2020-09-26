# Example Ionic App using libp2p

An example Ionic app that uses libp2p to connect to a remote peer via webRTC and display messages received in the app.  This is intended to be used in conjunction with the example libp2p peer found [here](https://github.com/acolytec3/libp2p_node_router)

## Usage

#### webRTC STAR server 

As currently configured, this app is looks for a [webRTC STAR server running on your local network](https://github.com/libp2p/js-libp2p-webrtc-star#rendezvous-server-aka-signaling-server).  Set additional remote STAR servers (e.g. `/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star`) as desired.  Update the IP address in the `addresses` section of the `options` object with address of your STAR server and adjust the multiaddress as required

### In browser

To run this in browser, just run `npm run start` and the app should launch in browser.  Run the nodejs router peer in a separate terminal and you should see connected peers (hopefully including your nodejs peer) appear in the `Peers` tab of the app.  

Send POST requests to the nodejs peer's IP address on port 8081 and those messages should all appear in the `Messages` if everything is connected up correctly.

### On Android

_Coming soon..._


