import Input from './Input'
import Button from "./Button.jsx";

const PersonForm = ({newPerson, onChange, onSubmit}) => {
    return (
        <form onSubmit={onSubmit}>
            <Input
                name='name'
                value={newPerson.name}
                onChange={onChange}
            />
            <Input
                name='number'
                value={newPerson.number}
                onChange={onChange}
            />
            <Button type='submit' onClick={onSubmit} text='add'/>
        </form>
    )
}

export default PersonForm;
