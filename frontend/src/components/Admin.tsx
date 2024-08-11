import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { CreateProblem } from "./CreateProblem.tsx";

export function Admin() {
    const [socket, setSocket] = useState<null | Socket>();
    const [quizId, setQuizId] = useState<null | string>();
    const [roomId, setRoomId] = useState<null | string>();

    useEffect(() => {
        const socket = io('http://localhost:3000');
        setSocket(socket);
        socket.on('connect', () => {
            console.log('client-connect: ', socket.id);
            socket.emit('join_admin', {
                password: "ADMIN_PASSWORD"
            })
        })
    }, []);

    if (!socket) {
        console.log('socket undefined')
        return <div>Socket Not Found</div>
    }

    // if (!roomId) {
    //     console.log('room undefined')
    //     return <div>Room Not Found</div>
    // }

    if (!quizId) {
        return (
            <div>
                <input type={"text"} onChange={(e) => {
                    setRoomId(e.target.value);
                }}/>
                <br/><br/>
                <button onClick={() => {
                    socket.emit('create_quiz');
                    setQuizId(roomId);
                }}>
                    Create Room
                </button>
            </div>
        )
    }
    return <CreateProblem socket={socket} roomId={quizId}/>
}