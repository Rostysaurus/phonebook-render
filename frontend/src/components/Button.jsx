const Button = ({onClick, text, type}) =>
    <button
        onClick={onClick}
        type={type}>
        {text}
    </button>

export default Button;
