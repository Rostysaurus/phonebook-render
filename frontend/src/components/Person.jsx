import Button from "./Button.jsx";

const Person = ({person, onDelete}) => {
    const {name, number, id} = person;

    const style = {
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        gap: "10px"
    }
    return (
        <div style={style}>
            <h4>{name} {number}</h4>
            <Button type='button' onClick={() => onDelete(id)} text='delete'/>
        </div>
    )
}

export default Person
