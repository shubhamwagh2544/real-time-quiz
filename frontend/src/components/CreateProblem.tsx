import { useState } from "react";
import {Socket} from "socket.io-client";

export function CreateProblem({socket, roomId}: {socket: Socket, roomId: string}) {
    const [title, setTitle] = useState<string | null>("");
    const [description, setDescription] = useState<string | null>("");
    const [answer, setAnswer] = useState<number>(0);
    const [options, setOptions] = useState([
        {
            id: 0,
            title: ""
        }, {
            id: 1,
            title: ""
        }, {
            id: 2,
            title: ""
        }, {
            id: 3,
            title: ""
        }
    ]);

    return (
        <div>
            Create Problem!
            <br />
            Problem = {" "}
            <input type={"text"} onChange={(e) => {
                setTitle(e.target.value);
            }} />
            <br />
            Description = {" "}
            <input type={"text"} onChange={(e) => {
                setDescription(e.target.value);
            }} />
            <br/>
            {[0, 1, 2, 3].map(optionId =>
                <div>
                    <input type={"radio"} checked={optionId === answer} onChange={() => {
                        setAnswer(optionId);
                    }}/>
                    Option {optionId}{" "}
                    <input type={"text"} onChange={(e) => {
                        setOptions(options => options.map(x => {
                            if (x.id === optionId) {
                                return {
                                    ...x,
                                    title: e.target.value
                                }
                            }
                            return x;
                        }))
                    }}
                    ></input>
                    <br />
                    {/*{JSON.stringify(options)}*/}
                </div>
            )}
            <br />
            <button onClick={() => {
                socket.emit('create_problem', {
                    roomId,
                    problem: {
                        title: title,
                        description,
                        options,
                        answer
                    }
                })
            }}>
                Add Problem
            </button>
        </div>
    )
}