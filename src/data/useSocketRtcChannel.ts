import {useCallback, useEffect, useState} from "react";

import {Answer, IccCandidate, Offer} from "./types/Room";
import {getSocket, logWithTimestamp} from "../data/SocketConnection";


export function useSocketRtcChannel(
    onReceiveIceCandidate: (iccCandidate: IccCandidate) => void,
    onReceiveOffer: (offer: Offer) => void,
    onReceiveAnswer: (answer: Answer) => void,
) {
    const socket = getSocket()
    const mySocketId = socket?.id ?? ""
    useEffect(() => {
        const handleOnNewICeCandidate = (iccCandidate: IccCandidate) => {
            logWithTimestamp(`handleOnNewICeCandidate`, iccCandidate)
            onReceiveIceCandidate(iccCandidate)
        }
        const handleOnOffer = (offer: Offer) => {
            logWithTimestamp(`handleOnNewOffer`, offer)
            onReceiveOffer(offer)
        }
        const handleOnAnswer = (answer: Answer) => {
            logWithTimestamp(`handleOnAnswer`, answer)
            onReceiveAnswer(answer)
        }

        socket.on('ice_candidate', handleOnNewICeCandidate);
        socket.on('offer', handleOnOffer);
        socket.on('answer', handleOnAnswer);
        return () => {
            socket.off('ice_candidate', handleOnNewICeCandidate);
            socket.off('offer', handleOnOffer);
            socket.off('answer', handleOnAnswer);

        }
    }, [socket, onReceiveIceCandidate]);


    const sendIccCandidate = useCallback((IccCandidate: IccCandidate) => {
        socket?.emit("ice_candidate", IccCandidate)
    }, [socket])

    const sendOffer = useCallback((offer: Offer) => {
        socket?.emit("offer", offer)
    }, [socket])

    const sendAnswer = useCallback((answer: Answer) => {
        socket?.emit("answer", answer)
    }, [socket])


    return {
        sendIccCandidate,
        mySocketId,
        sendOffer,
        sendAnswer
    }
}