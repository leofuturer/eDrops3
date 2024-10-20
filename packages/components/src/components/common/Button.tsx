export function Button({...props}) {
    return (
        <button {...props} className="bg-secondary hover:bg-secondary-dark text-white rounded-md p-4"/>
    )
}

export default Button