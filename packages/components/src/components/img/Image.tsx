export function Image({...props}: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
    return (
        <img {...props} />
    )
}

export default Image