import React, {useRef, useState} from "react";


interface VideoTemplateViewProps {
    roomName: string
    personName: string
}


export const VideoGridView: React.FC<VideoTemplateViewProps> = ({roomName, personName}) => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<{ [socketId: string]: MediaStream }>({})
    const [peerConnections, setPeerConnections] = useState<{ [socketId: string]: RTCPeerConnection }>({})
    /*
      const setupPeerConnection = async (socketId: string) => {
          const localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
          const pc = new RTCPeerConnection({
              iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
          });
          pc.getSenders()
          localStream.getTracks().forEach(track => {
              pc.addTrack(track, localStream);
          })
          if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStream
          }
          pc.onicecandidate = (rtcPeerConnectionEvent) => {
              if (rtcPeerConnectionEvent.candidate) {
                  const IceCandidateRequest: IccCandidateRequest = {
                      iccCandidate: rtcPeerConnectionEvent.candidate,
                      fromSocketId: socketId
                  }
                  socket?.emit('ice-candidate', IceCandidateRequest);
              }
          }
          pc.ontrack = (event) => {
              const remoteStream = event.streams[0]
              setRemoteStreams((prevStreams) => ({...prevStreams, [socketId]: remoteStream}))
          }
          setPeerConnections((prevConnections) => ({...prevConnections, [socketId]: pc}))
          return pc
      }
      const createOffer = async (socketId: string) => {
          const pc = peerConnections[socketId]
          if (pc) {
              const offer = await pc.createOffer()
              await pc.setLocalDescription(offer)
              const offerRequest: OfferRequest = {
                  offer: offer,
                  roomName: roomName,
                  offerFrom: socketId
              }
              socket?.emit('offer', offerRequest)
          }

      }
      useEffect(() => {
          if (socket) {
              const roomJoinRequest: RoomJoinRequest = {
                  roomName: roomName,
                  personName: personName
              }
              socket.emit("join_room", roomJoinRequest)

              socket.on("user_joined", async (roomMessage: RoomMessage) => {
                  const pc = await setupPeerConnection(roomMessage.socketId)
                  createOffer(roomMessage.socketId)
              })


              socket.on("offer", async (offerRequest: OfferRequest) => {
                  const pc = await setupPeerConnection(socket.id ?? "")
                  const answer = await pc.createAnswer()
                  await pc.setRemoteDescription(offerRequest.offer)
                  await pc.setLocalDescription(answer)
                  const answerRequest: AnswerRequest = {
                      answer: answer,
                      roomName: roomName,
                      answerFor: offerRequest.offerFrom
                  }
                  socket.emit("answer", answerRequest);
              })
              socket.on("answer", async (answerRequest: AnswerRequest) => {
                  const pc = peerConnections[answerRequest.answerFor]
                  await pc.setRemoteDescription(answerRequest.answer)
              })
              socket?.on("ice-candidate", async (iccCandidateRequest: IccCandidateRequest) => {
                  console.log("tce-candidate received", iccCandidateRequest);
                  const pc = peerConnections[iccCandidateRequest.fromSocketId]
                  if (pc) {
                      await pc.addIceCandidate(iccCandidateRequest.iccCandidate);
                  }
              })
          }

      }, [peerConnections]);
  */
    const getGridCols = (participants: number) => {
        if (participants === 1) {
            return "grid-cols-1";
        } else if (participants === 2) {
            return "md:grid-cols-2";
        } else if (participants === 3) {
            return "md:grid-cols-3";
        } else if (participants === 4) {
            return "md:grid-cols-2 lg:grid-cols-2 grid-rows-2";
        } else {
            return "md:grid-cols-3 lg:grid-cols-4";
        }
    };

    return (<div className="flex-1 p-4 overflow-auto">
        <div className={`grid gap-4  ${getGridCols(Object.keys(remoteStreams).length + 1)}`}>
            <div
                className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                <video ref={localVideoRef}
                       autoPlay
                       playsInline
                       muted className="h-full w-full text-gray-400">
                </video>
            </div>
            {Object.keys(remoteStreams).map((socketId) => (
                <div key={socketId} className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                    <video autoPlay playsInline className="h-full w-full text-gray-400" ref={(el) => {
                        if (el) {
                            el.srcObject = remoteStreams[socketId];
                        }
                    }}/>
                </div>
            ))}

        </div>
    </div>)
}