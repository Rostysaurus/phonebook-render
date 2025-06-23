const Input = ({name, value, onChange}) => (
    <div>
        <label htmlFor={name}>{`${name}: `}</label>
        <input
            name={name}
            onChange={onChange}
            value={value}/>
    </div>
)

export default Input
