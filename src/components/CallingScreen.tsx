import React, {useEffect, useRef} from "react";
import {io, Socket} from "socket.io-client";

export const CallingScreen = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerConnection = useRef<RTCPeerConnection | undefined>();
    const socket = useRef<Socket | undefined>();

    useEffect(() => {
        const soc = io("http://192.168.1.6:4000")
        soc.on("connect", async () => {
            const localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
            }

            const pc = new RTCPeerConnection({
                iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
            });
            peerConnection.current = pc;

            localStream.getTracks().forEach((trck) => {
                pc.addTrack(trck, localStream)
            })

            pc.ontrack = (event: RTCTrackEvent) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };

            pc.onicecandidate = ((ev: RTCPeerConnectionIceEvent) => {
                if (ev.candidate) {
                    soc.emit("send-icecandidate", ev.candidate);
                }
            })
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            soc.emit("send-offer", offer)
        })

        soc.on("receive-icecandidate", (candidate: RTCIceCandidate) => {
            peerConnection.current?.addIceCandidate(candidate)
        })
        soc.on("receive-offer", async (offer: RTCSessionDescriptionInit) => {
            const pc = peerConnection.current
            if (pc) {
                await pc.setRemoteDescription(offer)
                const answer = await pc.createAnswer()
                await pc.setLocalDescription(answer)
                soc.emit("send-answer", answer)
            }


        })
        soc.on("receive-answer", async (answer: RTCSessionDescriptionInit) => {
            peerConnection.current?.setRemoteDescription(answer)
        })

        socket.current = soc
        return () => {
            peerConnection.current?.close();
            soc.disconnect();
        };
    }, []);

    return (<div className="flex-1 p-4 overflow-auto">
        <div className={`grid gap-4  md:grid-cols-2`}>
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
                <video autoPlay playsInline className="h-full w-full text-gray-400" ref={remoteVideoRef}/>
            </div>


        </div>
    </div>)
}