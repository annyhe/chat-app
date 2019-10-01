import React from 'react'

/* InputMessage component - used to type the message */
export default class InputMessage extends React.Component {
    handleSendMessage = event => {
        event.preventDefault()
        /* Disable sendMessage if the message is empty */
        if (this.messageInput.value.length > 0) {
            this.props.socket.emit('chat_message', this.messageInput.value)
            /* Reset input after send*/
            this.messageInput.value = ''
        }
    }
    handleTyping = () => {
        /* Tell users when another user has at least started to write */
        if (this.messageInput.value.length > 0) {
            this.props.typing(this.ownerInput.value)
        } else {
            /* When there is no more character, the user no longer writes */
            this.props.resetTyping(this.ownerInput.value)
        }
    }
    render() {
        /* If the chatbox state is loading, loading class for display */
        let loadingClass = this.props.isLoading
            ? 'chatApp__convButton--loading'
            : ''
        let sendButtonIcon = <span>&#x2709;</span>
        return (
            <form onSubmit={this.handleSendMessage}>
                <input
                    type="hidden"
                    ref={owner => (this.ownerInput = owner)}
                    value={this.props.owner}
                />
                <input
                    type="hidden"
                    ref={ownerAvatar => (this.ownerAvatarInput = ownerAvatar)}
                    value={this.props.ownerAvatar}
                />
                <input
                    type="text"
                    ref={message => (this.messageInput = message)}
                    className={'chatApp__convInput'}
                    placeholder="Text message"
                    onKeyDown={this.handleTyping}
                    onKeyUp={this.handleTyping}
                    tabIndex="0"
                />
                <div
                    className={'chatApp__convButton ' + loadingClass}
                    onClick={this.handleSendMessage}
                >
                    {sendButtonIcon}
                </div>
            </form>
        )
    }
}