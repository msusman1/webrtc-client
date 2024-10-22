import React, {useContext, useEffect, useRef} from "react";
import {SocketContext} from "../App";

interface VideoGridViewProps {
    roomName: string;
    personName: string;
}

export const VideoGridView: React.FC<VideoGridViewProps> = ({roomName, personName}) => {
    const socket = useContext(SocketContext);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const pc = new RTCPeerConnection({
            iceServers: [{urls: 'stun:stun.l.google.com:19302'},]
        });
        pc.onicecandidate = e => {
            if (e.candidate) {
                socket?.emit('iceCandidate', e.candidate);
            }
        }
        pc.ontrack = e => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = e.streams[0];
            }
        }

        socket?.on("getOffer", async (sdf) => {
            console.log("getOffer", sdf);
            await pc.setRemoteDescription(sdf)
            const sdfAnswer = await pc.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            })
            await pc.setLocalDescription(sdfAnswer);
            socket.emit("answer", sdfAnswer);
        })
        socket?.on("getIceCandidate", async (candidate) => {
            console.log("onGetCandidates", candidate);
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        })
        socket?.on("getAnswer", async (sdf) => {
            console.log("onGetAnswer", sdf);
            await pc.setRemoteDescription(sdf);
        })

        peerConnectionRef.current = pc;

        return () => {
            pc.close();
            socket?.off('getOffer');
            socket?.off('getIceCandidate');
            socket?.off('getAnswer');
        };
    }, [socket]);


    const startCall = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = mediaStream;
            }
            mediaStream.getTracks().forEach(track => {
                peerConnectionRef?.current?.addTrack(track, mediaStream);
            })
            const offer = await peerConnectionRef?.current?.createOffer();
            await peerConnectionRef.current?.setLocalDescription(offer);
            socket?.emit('offer', offer);
            console.log('Offer sent:', offer);
        } catch (e) {
            console.error("error startCall", e);
        }

    }

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
        <div className={`grid gap-4  ${getGridCols(2)}`}>
            <div
                className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                <video ref={localVideoRef}
                       autoPlay
                       playsInline
                       muted className="h-full w-full text-gray-400">
                </video>
            </div>
            <div
                className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                <video ref={remoteVideoRef}
                       autoPlay
                       playsInline
                       muted className="h-full w-full text-gray-400">
                </video>
            </div>
        </div>
        <button onClick={startCall}>startCall</button>
    </div>)
}