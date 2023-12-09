export const Intro = ({heading, subheading}: IntroProps) => {
    return (
        <div>
            <p className="text-center text-xl font-bold">{heading}</p>
            <p className="text-center mb-4">{subheading}</p>
        </div>
    )
}

export type IntroProps = {
    heading: string;
    subheading: string;
}
