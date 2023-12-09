import {PropsWithChildren} from "react";

export const Position = ({heading, timestamps, children}: PropsWithChildren<PositionProps>) => {
    return (
        <div className="mb-4">
            <h2 className="text-lg font-bold">{heading}</h2>
            <p className="text-sm mb-2">{timestamps}</p>
            <div>{children}</div>
        </div>
    )
}

export type PositionProps = {
    heading: string;
    timestamps?: string;
}
