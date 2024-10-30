// import LogoDark from '../../assets/logo-dark.png'
import LogoLight from '../../assets/logo-light.png'
import Image from '../img/Image'
export function Logo() {
    return (
        <div className="max-h-full h-full">
            <Image src={LogoLight} alt="eDroplets Logo" className="max-h-[60px] aspect-auto"/>
        </div>
    )
}

export default Logo