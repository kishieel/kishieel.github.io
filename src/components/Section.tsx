import {PropsWithChildren} from "react";

export const Section = ({heading, children}: PropsWithChildren<SectionProps>) => {
    return (
        <section className="mb-4">
            <h1 className="text-2xl font-extrabold mb-3">{heading}</h1>
            <div>{children}</div>
        </section>
    )
}

export type SectionProps = {
    heading: string;
}
