const Notification = ({message}) => {
    if (message === null) {
        return null
    }
    
    const style = {
        color: message.type === 'success' ? 'green' : 'red',
        backgroundColor: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
    }


    return (
        <div style={style}>
            {message.text}
        </div>
    )
}

export default Notification
