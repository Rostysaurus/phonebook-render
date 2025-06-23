const Filter = ({label, value, onChange}) => (
    <div>
        <label htmlFor={label}>{label}: </label>
        <input onChange={onChange} value={value}/>
    </div>
)

export default Filter;
