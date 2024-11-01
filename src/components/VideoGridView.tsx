import React, {useEffect, useRef, useState} from "react";
import {Answer, IccCandidate, Offer, Peer} from "@/data/types/Room";
import {useSocketRoomChannel} from "../data/useSocketRoomChannel";
import {useSocketRtcChannel} from "../data/useSocketRtcChannel";
import {logWithTimestamp} from "../data/SocketConnection";


interface VideoTemplateViewProps {
    roomName: string
    personName: string
}


export const VideoGridView: React.FC<VideoTemplateViewProps> = ({roomName, personName}) => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const peerConnections = useRef<{ [socketId: string]: RTCPeerConnection }>({});
    const [remoteStreams, setRemoteStreams] = useState<{ [socketId: string]: MediaStream }>({})

    //other peer socket id, lets have rtc connection
    const setupPeerConnection = async (peerSocketId: string) => {
        logWithTimestamp(`setupPeerConnection, peerSocketId:`, peerSocketId);
        const pc = new RTCPeerConnection({
            iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
        });
        logWithTimestamp(`Lets add local stream to pc`, localStream);
        localStream?.getTracks().forEach(track => {
            pc.addTrack(track, localStream);
        })

        pc.ontrack = (event) => {
            const remoteStream = event.streams[0]
            logWithTimestamp(`On Receive remote stream from peer: ${peerSocketId} video tracks`, remoteStream.getVideoTracks());
            setRemoteStreams((prevStreams) => ({...prevStreams, [peerSocketId]: remoteStream}))
        }
        pc.onicecandidate = (rtcPeerConnectionEvent) => {
            if (rtcPeerConnectionEvent.candidate) {
                const iccCandidate: IccCandidate = {
                    iccCandidate: rtcPeerConnectionEvent.candidate,
                    fromPeer: mySocketId ?? "",
                    toPeer: peerSocketId,
                }
                sendIccCandidate(iccCandidate)
            }
        }
        return pc
    }

    const onUserJoined = async (peer: Peer) => {
        const isCurrentUser = peer.socketId === mySocketId
        logWithTimestamp(`onUserJoined isCurrentUser:${isCurrentUser}`, peer)
        if (isCurrentUser) {
            const mediaStream = await window.navigator.mediaDevices.getUserMedia({audio: false, video: true})
            setLocalStream(mediaStream)
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream
            }
        } else {
            //set up one to one peer connection to newly joined user
            const pc = await setupPeerConnection(peer.socketId)
            peerConnections.current[peer.socketId] = pc
            // now create offer to newly joined user
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            const mOffer: Offer = {
                offer: offer,
                fromPeer: mySocketId ?? "",
                toPeer: peer.socketId,
            }
            setTimeout(() => {
                sendOffer(mOffer)
                logWithTimestamp(`sent Offer to `, peer)
            }, 10000) // add some delay so peer can setup the local media steam

        }

    }

    //newly joined user will received an offer
    // and setup peer connection to the user who send the offer
    // and will send back the response to the user who send the offer
    const onReceiveOffer = async (offer: Offer) => {
        logWithTimestamp(`receive Offer from `, offer.fromPeer)
        const pc = await setupPeerConnection(offer.fromPeer)
        peerConnections.current[offer.fromPeer] = pc
        await pc.setRemoteDescription(offer.offer)
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        const mAnswer: Answer = {
            answer: answer,
            fromPeer: mySocketId ?? "",
            toPeer: offer.fromPeer
        }
        sendAnswer(mAnswer)
        logWithTimestamp(`sent answer to `, mAnswer.toPeer)
    }

    //newly joined user sent answer will be received here
    const onReceiveAnswer = async (answer: Answer) => {
        logWithTimestamp(`receive answer from `, answer.fromPeer)
        const pc = peerConnections.current[answer.fromPeer]
        await pc?.setRemoteDescription(answer.answer)
    }


    const onUserLeft = (peer: Peer) => {
        logWithTimestamp(`onUserLeft`, peer)
        peerConnections.current[peer.socketId]?.close();
        delete peerConnections.current[peer.socketId]
        setRemoteStreams(prevStreams => {
            const {[peer.socketId]: _, ...remainingStreams} = prevStreams;
            return remainingStreams;
        });

    }
    const onReceiveIceCandidate = async (iceCandidate: IccCandidate) => {
        const pc = peerConnections.current[iceCandidate.fromPeer]
        await pc?.addIceCandidate(iceCandidate.iccCandidate);
    }


    useSocketRoomChannel(onUserJoined, onUserLeft)
    const {
        mySocketId,
        sendIccCandidate,
        sendOffer,
        sendAnswer
    } = useSocketRtcChannel(onReceiveIceCandidate, onReceiveOffer, onReceiveAnswer)

    useEffect(() => {
        return () => {
            localStream?.getTracks().forEach((track) => track.stop());
        };
    }, [localStream]);

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

            {Object.entries(remoteStreams).map(([socketId, stream]) => (
                <div key={socketId}
                     className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                    <video key={socketId+stream.id} autoPlay playsInline className="h-full w-full text-gray-400" ref={(el) => {
                        if (el && el.srcObject !== stream) {
                            el.srcObject = stream;
                        }
                    }}/>
                </div>
            ))}

        </div>
    </div>)
}
const getGridCols = (participants: number) => {
    const colsMap: { [key: number]: string } = {
        1: "grid-cols-1",
        2: "md:grid-cols-2",
        3: "md:grid-cols-3",
        4: "md:grid-cols-2 lg:grid-cols-2 grid-rows-2",
    };
    return colsMap[participants] || "md:grid-cols-3 lg:grid-cols-4";
};
