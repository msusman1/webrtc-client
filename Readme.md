# WebRTC Client Demo

This project is a frontend implementation of a WebRTC client with features for real-time audio-video streaming and chat messaging. It allows users to create and join rooms, enabling seamless peer-to-peer communication. 

![App Screenshot](https://github.com/msusman1/webrtc-client/blob/master/media/app_screenshot.png)

## Features

- **Room Management**: Create and join video chat rooms.
- **Real-Time Audio/Video Streaming**: High-quality peer-to-peer video and audio connection.
- **Real-Time Chat Messaging**: Text messaging over a Socket.IO connection.

## Tech Stack

- **React** with **TypeScript** for building the UI.
- **WebRTC** for real-time audio and video streaming.
- **Socket.IO** for managing signaling and chat messaging.
- **Tailwind CSS** and **Shadcn UI** for styling and UI components.

## Prerequisites

1. **Signaling Server**: Before running this client, ensure the signaling server is set up. Follow instructions at: [WebRTC Server Repo](https://github.com/msusman1/webrtc-server).
2. **Configure Signaling Server URL**:
   - Set the server URL in `SocketConnection.ts` by updating `SERVER_URL` to point to your running signaling server.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/msusman1/webrtc-client.git
   cd webrtc-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app:
   ```bash
   npm start
   ```

## Known Issues

- **Remote Streams Not Displaying**: The UI currently does not display streams from other users, even though they are successfully received in the `RTCPeerConnection.ontrack` event. This issue is under investigation.

## Contributing

We welcome contributions to enhance the functionality of this WebRTC client demo!

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b my-new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -am 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin my-new-feature
   ```
5. Create a new Pull Request.

## License

MIT License © 2023 msusman1

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
